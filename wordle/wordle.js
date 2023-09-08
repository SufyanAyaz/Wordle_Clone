let row = 0;
let block = 0;
let dict;
const startbtn = document.getElementById("start");
const dark = document.getElementById("darkmode");
const hintIcon = document.getElementById("gethint");
const instruction = document.getElementById("gameinfo");
const body = document.querySelector("body");
const head = document.getElementById("header");
const nav = document.getElementById("nav");
const instructionInfo = document.getElementById("instructionInfo");
const congratsImage = document.getElementById("congratulations");
const mainGame = document.getElementById("mainGame");
const gameBox = document.getElementById("gameBox");
const messageSection = document.getElementById("messageSection");
const messageDiv = document.getElementById("message");
const footer = document.getElementById("footer");
const footerText = document.getElementById("footerText");

dark.addEventListener("click", () => {
    body.classList.toggle("dark");
    head.classList.toggle("dark");
    nav.classList.toggle("dark");
    instructionInfo.classList.toggle("dark");
    messageDiv.classList.toggle("dark-message");
    footer.classList.toggle("dark");
    footerText.classList.toggle("dark");
    dark.classList.toggle("dark");
    hintIcon.classList.toggle("dark");
    instruction.classList.toggle("dark");
    for (let r = 0; r < 4; r++) {
        for (let b = 0; b < 4; b++) {
            const gameBox = document.getElementById(`${r}-${b}`);
            gameBox.classList.toggle("dark");
        }
    }
});

instruction.addEventListener("click", () => {
    mainGame.classList.toggle("game-info");
    instructionInfo.classList.toggle("info");
});

const getDictionary = async function () {
    startbtn.innerText = "Loading...";
    startbtn.disabled = true;
    const apiResponse = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {
            "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
        },
    });

    let json = await apiResponse.json();
    let { dictionary } = json;
    startbtn.innerText = "Start Over";
    startbtn.disabled = false;
    return dictionary;
};

const getDict = async function () {
    dict = await getDictionary();
    startDictionary(dict);
};

const startDictionary = (diction) => {
    congratsImage.style.display = "none";
    gameBox.style.display = "grid";

    let randIndex = Number.parseInt(Math.random() * diction.length);
    let { word, hint } = diction[randIndex];
    let wordEntered = ['', '', '', ''];

    startbtn.addEventListener("click", () => {
        startbtn.innerText = "Loading...";
        startbtn.disabled = true;
        congratsImage.style.display = "none";
        gameBox.style.display = "grid";

        for (let r = 0; r < 4; r++) {
            for (let b = 0; b < 4; b++) {
                const gameBox = document.getElementById(`${r}-${b}`);
                gameBox.classList.remove("normal-letter", "right-letter", "wrong-letter");
                gameBox.innerText = '';
            }
        }

        row = 0;
        block = 0;

        messageSection.classList.remove("wrong-message", "correct-message", "hint-message");
        messageDiv.innerText = '';

        let randInd = Number.parseInt(Math.random() * diction.length);
        word = diction[randInd]['word'];
        hint = diction[randInd]['hint'];

        startbtn.innerText = "Start Over";
        startbtn.disabled = false;

        return;
    })

    hintIcon.addEventListener("click", () => {
        if (messageSection.classList.contains("hint-message")) {
            messageSection.classList.remove("hint-message");
            messageDiv.innerText = '';
        } else if (!messageSection.classList.contains("hint-message")) {
            messageSection.classList.add("hint-message");
            messageDiv.innerText = `Hint: ${hint}`;
        }
    })

    document.body.addEventListener("keyup", (event) => {
        const keyPressed = event.key;

        if (keyPressed.toLowerCase() == "enter") {
            let answerAttempt = wordEntered.join('').toUpperCase();
            let wordArray = word.split('');
            if (answerAttempt.length == word.length) {
                if (answerAttempt === word.toUpperCase()) {
                    congratsImage.style.display = "block";
                    gameBox.style.display = "none";
                    messageSection.classList.add("correct-message");
                    messageDiv.innerText = `You guessed the word ${word.toUpperCase()} correctly!`;

                    for (let k = 0; k < wordEntered.length; k++) {
                        const gameBox = document.getElementById(`${row}-${k}`);
                        gameBox.classList.add("right-letter");
                    }

                    return;
                }
                else if (row <= 3) {
                    let checkArray = [0, 0, 0, 0];
                    for (let i = 0; i < wordArray.length; i++) {
                        if (wordEntered[i] == wordArray[i].toLowerCase()) {
                            const gameBox = document.getElementById(`${row}-${i}`);
                            gameBox.classList.add("right-letter");
                            wordArray[i] = '';
                            checkArray[i] = 1;
                        }
                    }

                    for (let j = 0; j < wordArray.length; j++) {
                        if (checkArray[j] == 0) {
                            if (wordArray.includes(wordEntered[j]) || wordArray.includes(wordEntered[j].toUpperCase())) {
                                const gameBox = document.getElementById(`${row}-${j}`);
                                gameBox.classList.add("wrong-letter");
                                let index = wordArray.indexOf(wordEntered[j]);
                                wordArray[index] = '';
                            }
                        }
                    }

                    for (let k = 0; k < wordArray.length; k++) {
                        const gameBox = document.getElementById(`${row}-${k}`);
                        gameBox.classList.add("normal-letter");
                    }

                    row++;
                    block = 0;
                    wordEntered = ['', '', '', ''];

                    if (row > 3) {
                        messageSection.classList.add("wrong-message");
                        messageDiv.innerText = `You missed the word ${word.toUpperCase()} and lost!`;
                        return;
                    }
                }
            }

            else {
                window.alert("You haven't entered a complete word! Please complete your word first!");
                row = row;
                block = block;
            }
        }

        if (keyPressed.toLowerCase() == "backspace" && block > 0) {
            block--;
            const gameBox = document.getElementById(`${row}-${block}`);
            gameBox.innerText = '';
            wordEntered[block] = '';
        }

        if (keyPressed.length === 1) {
            const gameBox = document.getElementById(`${row}-${block}`);
            gameBox.innerText = keyPressed.toUpperCase();
            wordEntered[block] = keyPressed;
            block++;
        }
    })
};

getDict();