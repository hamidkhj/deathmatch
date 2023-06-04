import { useEffect, useState } from "react";

function Word(props) {
    const [colors, setColors] = useState([]);

    useEffect(()=>{
        if(props.answer && props.isPlayer) {
            checkWord(props.answer, props.word, setColors);
        }
    },[props.answer, props.word]);

    return (

        <div className="wordContainer">
            <div className={`charInput ${colors[0]}`}>{props.word[0] || ''}</div>
            <div className={`charInput ${colors[1]}`}>{props.word[1] || ''}</div>
            <div className={`charInput ${colors[2]}`}>{props.word[2] || ''}</div>
            <div className={`charInput ${colors[3]}`}>{props.word[3] || ''}</div>
            <div className={`charInput ${colors[4]}`}>{props.word[4] || ''}</div>
        </div>

    );
}

function checkWord (answer, guess, setColors) {
    // find green letters
    let currentGuess = guess.split('');
    answer = answer.split('')
    let colors = {};
    for (let i = 0; i < 5; i++){
        if (currentGuess[i] == answer[i]) {
            colors[i] = 'green';
            currentGuess[i] = '_';
            answer[i] = '_';
        } 
    }
    // find yellow letters
    answer = answer.toString();
    for (let i = 0; i < 5; i++){

        if (currentGuess[i] != "_") {
            if(answer.indexOf(currentGuess[i]) != -1) {
                // setColors({...colors, i: "yellow"})
                colors[i] = 'yellow';
            } else {
                // setColors({...colors, i: "grey"})
                colors[i] = 'grey';
            }
        } 
    }
    setColors(colors)
}


export default Word;