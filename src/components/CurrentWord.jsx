import { useState } from "react";

function CurrentWord(props) {
    const [word, setWord] = useState('');

    const handleInput = (e) => {
        const regex = /^[a-zA-Z]+$/
        if (e.target.value === '' || regex.test(e.target.value)) {
            setWord(e.target.value)
        }
        if (e.target.value.length === 5) {
            setWord('');
            props.handlePlayerWords(e.target.value)
        }
    }

    return (
        <div className="inputContainer">
            <input 
                disabled={!props.isPlaying}
                type="text" 
                name="word" id="word" 
                value={word}
                onChange={handleInput}
            />
        </div>
    );
}

export default CurrentWord;