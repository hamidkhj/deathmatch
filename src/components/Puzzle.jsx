import { useEffect, useState } from "react";
import words from "../utils/words";
import Word from "./Word";
import CurrentWord from "./CurrentWord";

function Puzzle() {

    const [playerWords, setPlayerWords] = useState([]);
    const [botWords, setBotWords] = useState([]);
    const [allWords, setAllWords] = useState([]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [winner, setWinner] = useState("");
    const [target, setTarget] = useState('');
    const [validGuesses, setValidGuess] = useState([]);
    const [difficulty, setDifficulty] = useState(1); //1 easy, 2 medium , 3 hard

    useEffect(()=> {
        newGame();
    }, [])

    const handlePlayerWords = (word) => {
        if(isPlaying) {
            setPlayerWords(
                [word, ...playerWords]
            );
                
            if (word == target) {
                setBotWords([word, ...botWords])
                setIsPlaying(!isPlaying);
                setWinner('Player');
            }

            let newGuess = guess();
            setBotWords([newGuess, ...botWords])
            setAllWords([word, newGuess, ...allWords]);
        }
    }

    let newGame = () => {
        setValidGuess(words);
        setPlayerWords([]);
        setBotWords([]);
        setAllWords([]);
        setWinner('');
        setIsPlaying(true);
        setTarget(words[Math.floor(Math.random() * words.length)].toLocaleLowerCase());
    }

    let filterWords = (greenLetters, yellowLetters, greyLetters, currentGuess) => {
        console.log(target);
        let difficultyCheck = Math.random() * 10;
        let newGuessList = validGuesses;

        // filter words with grey letters
        if (greyLetters.size > 0 && difficultyCheck < difficulty * 3 && difficulty > 2) {

            greyLetters.forEach(letter => {
                newGuessList = newGuessList.filter((word) => {
                    if (word.toLowerCase() != target && word.toLowerCase().indexOf(letter) != -1) {
                        return false;
                    }

                    return true;
                })
            });
        }

        // filter words with green letters

        if (greenLetters.length > 0) {

            greenLetters.forEach((letter, index) => {
                newGuessList = newGuessList.filter((word) => {
                    if (word[index].toLowerCase() !== letter) {
                        return false;
                    }
                    return true;
                })
            })

        }

        // filter words with yellow letters

        if (yellowLetters.length > 0 && difficultyCheck < difficulty * 3 && difficulty > 2) {

            newGuessList = newGuessList.filter((word) => {
                let hasLetter = true;
                yellowLetters.forEach((letter) => {
                    if (word.toLowerCase().indexOf(letter) == -1) {
                        hasLetter = false;
                    }
                })

                return hasLetter;
            })
        }

        // remove current guess 
        newGuessList = newGuessList.filter((word)=> {
            return word.toLowerCase() != currentGuess;
        })
       
       
        setValidGuess(newGuessList);
        
        console.log(validGuesses);
    }


    let guess = () => {
        const greenLetters = [];
        const yellowLetters = [];
        const greyLetters = new Set();

        let answer = target.split('');
        let currentGuess = '';

        //generate first guess
        if (currentGuess === '') {
            currentGuess = validGuesses[Math.floor(Math.random() * validGuesses.length)].toLowerCase().split('');
        }

        // compare guess to target
        // find green letters
        for (let i = 0; i < 5; i++) {
            if (currentGuess[i] == target[i]) {
                greenLetters[i] = currentGuess[i];
            }
        }
        // find yellow letters
        answer = answer.join('');
        for (let i = 0; i < 5; i++) {

            if (currentGuess[i] != "_") {
                if (answer.indexOf(currentGuess[i]) != -1) {
                    yellowLetters.push(currentGuess[i])
                } else {
                    greyLetters.add(currentGuess[i])
                }
            }
        }

        if (currentGuess.join('') == target) {
            setIsPlaying(!isPlaying);
            setWinner('bot');
        } else {
            filterWords(greenLetters, yellowLetters, greyLetters, currentGuess.join(''));
        }

        return currentGuess.join('');
    }

    return (
        <div className="gamePage">

            <div className="mainContainer">
                {
                    allWords.map((word, index) => {
                        if (index % 2 != 0) {
                            return <Word word={word} answer={target} key={index} isPlayer={false} />
                        } else {
                            return <Word word={word} answer={target} key={index} isPlayer={true} />
                        }
                    })
                }
            </div>

            {/* view in fron of each other */}
            {/* <div className="mainContainer">
                <h1>player</h1>
                {
                    playerWords.map((word, index) => {
                        return <Word word={word} answer={target} key={index} isPlayer={true} />
                    })
                }
            </div>
            <div className="mainContainer">
                <h1>bot</h1>
                {
                    botWords.map((word, index) => {
                        return <Word word={word} answer={target} key={index} isPlayer={false} />
                    })
                }
            </div> */}
            <div>
                <button onClick={()=>{setDifficulty(1)}} className={`difficultyButton ${difficulty == 1 ? "selected" : ''}`}>easy</button>
                <button onClick={()=>{setDifficulty(2)}} className={`difficultyButton ${difficulty == 2 ? "selected" : ''}`}>medium</button>
                <button onClick={()=>{setDifficulty(3)}} className={`difficultyButton ${difficulty == 3 ? "selected" : ''}`}>hard</button>
                <CurrentWord handlePlayerWords={handlePlayerWords} isPlaying={isPlaying} />
                <div className={`messageBox ${isPlaying ? "hidden" : "shake"}`}>
                    <h1>{winner} WON</h1>
                    <p>The answer was <b>{target}</b></p>
                    <p>you can start a new game here</p>
                    <button onClick={newGame}>new game</button>

                </div>

            </div>
        </div>
    );
}


export default Puzzle;