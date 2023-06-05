import { useEffect, useState } from "react";
import words from "../utils/words";
import Word from "./Word";
import CurrentWord from "./CurrentWord";

function Puzzle() {

    const [playerWords, setPlayerWords] = useState([]); //keep record of player guesses (used for a side by side view)
    const [botWords, setBotWords] = useState([]); //keep record of bot guesses (used for a side by side view)
    const [allWords, setAllWords] = useState([]); // keep record of all  guesses
    const [isPlaying, setIsPlaying] = useState(true);
    const [winner, setWinner] = useState("");
    const [target, setTarget] = useState(''); // the target word 
    const [validGuesses, setValidGuess] = useState([]); // a list of remaining words as a valid guess for the bot
    const [difficulty, setDifficulty] = useState(20); //20 easy, 10 medium , 0 hard
    const [round, setRound] = useState(0); //

    useEffect(() => {
        newGame();
    }, [])

    // handle player input and game steps
    const handlePlayerWords = (word) => {
        if (isPlaying) {
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

    //start a new game
    let newGame = () => {
        setValidGuess(words);
        setPlayerWords([]);
        setBotWords([]);
        setAllWords([]);
        setWinner('');
        setIsPlaying(true);
        setTarget(words[Math.floor(Math.random() * words.length)].toLowerCase());
        setRound(0);
    }

    //filter words based on list of letters found in guess()
    let filterWords = (greenLetters, yellowLetters, greyLetters, currentGuess) => {

        console.log(target); //cheat so u can check the answer in console
        let newGuessList = validGuesses;


        if (round < difficulty) { //check if enough rounds have been played before taking it seriously 
            setRound(round + 1);
        } else {
            // filter words with grey letters
            if (greyLetters.size > 0) {

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

            if (yellowLetters.length > 0) {

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
        }


        // remove current guess from the list to prevend duplicate guesses 
        newGuessList = newGuessList.filter((word) => {
            return word.toLowerCase() != currentGuess;
        })


        //set the new valid guess list based on filltered words
        setValidGuess(newGuessList);

        console.log(validGuesses); // cheat so u can check the remaining valid words used by the bot
    }


    //guess a new word and compare it to the answer
    let guess = () => {
        const greenLetters = [];
        const yellowLetters = [];
        const greyLetters = new Set();

        let answer = target.split('');
        let currentGuess = '';

        //generate first guess
        if (currentGuess === '') {
            currentGuess = validGuesses[Math.floor(Math.random() * validGuesses.length)].toLowerCase();
            if (round < difficulty && currentGuess == target) { //check if not enough rounds have passed and make sure not to guess the right word
                while (currentGuess == target) {
                    currentGuess = validGuesses[Math.floor(Math.random() * validGuesses.length)].toLowerCase();
                }
            }
        }

        currentGuess = currentGuess.split('');

        // compare guess to target
        // find green letters
        for (let i = 0; i < 5; i++) {
            if (currentGuess[i] == target[i]) {
                greenLetters[i] = currentGuess[i];
            }
        }

        // find yellow and grey letters
        answer = answer.join('');
        for (let i = 0; i < 5; i++) {
            if (answer.indexOf(currentGuess[i]) != -1) {
                yellowLetters.push(currentGuess[i])
            } else {
                greyLetters.add(currentGuess[i])
            }
        }

        console.log(greyLetters);

        //check if the bot has won otherwise countinue the game
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
                {/* dificulty buttons */}
                <button onClick={() => { setDifficulty(20) }} className={`difficultyButton ${difficulty == 20 ? "selected" : ''}`}>easy</button>
                <button onClick={() => { setDifficulty(10) }} className={`difficultyButton ${difficulty == 10 ? "selected" : ''}`}>medium</button>
                <button onClick={() => { setDifficulty(0) }} className={`difficultyButton ${difficulty == 0 ? "selected" : ''}`}>hard</button>

                {/* player input */}
                <CurrentWord handlePlayerWords={handlePlayerWords} isPlaying={isPlaying} />

                {/* new game and winner message box */}
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