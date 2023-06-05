import { useState } from "react";

// handle player input
function CurrentWord(props) {
    const [word, setWord] = useState('');

    const handleInput = (e) => {
        const regex = /^[a-zA-Z]+$/ //make sure only letters are enterd
        if (e.target.value === '' || regex.test(e.target.value)) {
            setWord(e.target.value.toLowerCase())
        }
        if (e.target.value.length === 5) { //take player input if 5 letters are entered
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
                placeholder="Your Word"
            />
        </div>
    );
}

export default CurrentWord;