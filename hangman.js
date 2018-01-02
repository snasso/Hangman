/* This file is connected to hangman.html */

let words = [
    "hey",
    "person",
    "you",
    "think",
    "youre",
    "better",
    "than",
    "me"
];

let answer;
let nWrong;
let pastGuesses = [];
let pastGames   = [];
let cont        = true;

/* guess counter */
let guesses = 0;

document.querySelector("#previousGamesDiv").style.display = "none";

// Get things started
startGame();


function addClickListener() {

    document.querySelector("#submitButton").addEventListener("click", function () {
        let letterInput = document.querySelector("#letterInput").value;

        document.querySelector("#letterInput").value = "";

        game(letterInput);
    });
}


/* End of game Constructor Function */
function GameOver(win, pastGuesses, guesses) {
    let winLose = "Win";

    if (win == true) {
        winLose = "Won";
    } else {
        winLose = "Lost";
    }

    this.winLose        = winLose;
    this.pastGuesses    = pastGuesses;
    this.guesses        = guesses;

    return {
        "winLose": this.winLose,
        "pastGuesses": this.pastGuesses,
        "guesses": this.guesses
    };
}


function startGame() {
    document.querySelector("#gameDiv").innerHTML = "";
    document.querySelector("#messageDiv").innerHTML = "";

    addClickListener();

    setUpGame();

    printGameState();
}


function game(guess) {
    document.querySelector("#gameDiv").innerHTML = "";
    document.querySelector("#messageDiv").innerHTML = "";

    let output = document.createTextNode("");

    if (!(guess.match(/[a-z]/i))) {
        output = document.createTextNode("That is not a valid character. Please select from a-z");
    } else if (guess.length > 1) {
        output = document.createTextNode("Please enter only 1 letter at a time.");
    } else {

        if (pastGuesses.includes(guess)) {
            output = document.createTextNode("You have already tried this letter.");
        } else {
            pastGuesses.push(guess);

            if (!answer.includes(guess)) {
                nWrong += 1;
            }
            guesses += 1;
        }
    }

    printGameState();

    let pNode       = document.createElement("P");
    let textNode    = document.createTextNode(`Current Guess was: ${guess}`);
    pNode.appendChild(textNode);

    document.querySelector("#messageDiv").appendChild(pNode);
    document.querySelector("#messageDiv").appendChild(output);

    if (checkGameOver()) {
        let messageDiv  = document.querySelector("#messageDiv");
        let inputDiv    = document.querySelector("#inputDiv");
        let win         = false;

        let pNode       = document.createElement("P");
        let textNode    = document.createTextNode("");
        if (nWrong <= 5) {
            win         = true;
            textNode    = document.createTextNode("You win!");
        } else {
            textNode = document.createTextNode("You have reached the maximum number of guesses (6).");
        }
        pNode.appendChild(textNode);

        messageDiv.innerHTML = "";
        document.querySelector("#messageDiv").appendChild(pNode);

        addGameOverButton();

        let retObj = new GameOver(win, pastGuesses, guesses);
        pastGames.push(retObj);

        /* Outputs previous game results */
        for (var i = 0; i < pastGames.length; i++) {
            let previousGamesDiv = document.querySelector("#previousGames");

            if (i === 0) {
                document.querySelector("#previousGamesDiv").style.display = "block";
                previousGamesDiv.innerHTML = "";
            }

            let winLose         = pastGames[i].winLose;
            let previousGuesses = pastGames[i].pastGuesses;
            let numGuesses      = pastGames[i].guesses;

            let str = `Game Number ${i + 1}: Won / Lost: ${winLose} | `;
            str += `Past Guesses: ${previousGuesses} | Number of Guesses: ${numGuesses}`;

            let pNode = document.createElement("P");
            pNode.innerHTML = `${str}`;

            previousGamesDiv.appendChild(pNode);
        }
    } 
}


function addGameOverButton() {
    let html = 'Would you like to play again? y/n: <input type="text" ';
    html += 'id="letterInput" placeholder="y (yes) or n (no)."/>';
    html += '<button type="button" id="gameOverButton">Submit</button>';

    inputDiv.innerHTML = "";
    inputDiv.innerHTML += html;

    document.querySelector("#gameOverButton").addEventListener("click", function () {
        let letterInput = document.querySelector("#letterInput").value;

        if (letterInput.toLowerCase() === 'y') {
            let html = 'Input letter: <input type="text" id="letterInput" ';
            html += 'placeholder="(a-z)"/>';
            html += '<button type="button" class="btn btn-primary" id="submitButton">Submit</button>';

            inputDiv.innerHTML = html;

            startGame();
        } else if (letterInput.toLowerCase() === 'n') {
            cont = false;

            inputDiv.innerHTML = "";
            inputDiv.innerHTML += "<p>Good game!</p>";
        } else {
            inputDiv.innerHTML += "<p>Please enter either y (yes) or n (no).</p>";

            addGameOverButton();
        }
    });
}


function checkGameOver() {
    let sortedPastGuesses   = pastGuesses.sort();
    let slicedAnswer        = answer.slice(0);

    let uniqueAnswer = slicedAnswer.filter(function (elem, index, self) {
        return index == self.indexOf(elem);
    });

    let sortedUniqueAnswer = uniqueAnswer.sort();

    let result = sortedPastGuesses.filter(function (elem) {
        return sortedUniqueAnswer.indexOf(elem) > -1;
    }).length == sortedUniqueAnswer.length

    if (nWrong == 6 || result == true) {
        return true;
    }
    return false;
}


function printGameState() {
    document.querySelector("#infoDiv").innerHTML = "";

    let pNode       = document.createElement("P");
    let textNode    = document.createTextNode("");

    if (guesses !== 0) {
        textNode = document.createTextNode(`Previous Guesses: ${pastGuesses}`);
        pNode.appendChild(textNode);
        document.querySelector("#infoDiv").appendChild(pNode);
    }

    textNode = document.createTextNode(`Number of Guesses remaining: ${6 - nWrong}`);
    pNode.appendChild(document.createElement("br"));
    pNode.appendChild(textNode);
    document.querySelector("#infoDiv").appendChild(pNode);

    let str = "";

    // for each letter in the target word
    for (let i = 0; i < answer.length; i++) {
        let found = false;
        // loop through the pastGuesses
        for (let j = 0; j < pastGuesses.length; j++) {
            // and check each element of past guesses to see if it matches the answer
            if (answer[i] === pastGuesses[j]) {
                found = true;
            }
        }
        if (found) {
            str += answer[i];
            str += "\t";
        } else {
            str += "_\t";
        }
    }

    pNode = document.createElement("P");
    textNode = document.createTextNode(`${str}`);
    pNode.appendChild(textNode);
    document.querySelector("#infoDiv").appendChild(pNode);

    printHangMan(nWrong);
}


function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    
    return words[index];
}


function printHangMan(nWrong) {
    const headSpot  = (nWrong > 0) ? "O" : " ";
    const bodySpot  = (nWrong > 1) ? "|" : " ";
    const leftArm   = (nWrong > 2) ? "/" : " ";
    const rightArm  = (nWrong > 3) ? "\\" : " ";
    const leftLeg   = (nWrong > 4) ? "/" : " ";
    const rightLeg  = (nWrong > 5) ? "\\" : " ";

    let str = "&nbsp;___&nbsp;" + "<br>";
    str += "&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;" + "<br>";
    str += "&nbsp;|&nbsp;&nbsp;&nbsp;" + headSpot + "&nbsp;" + "<br>";
    str += "&nbsp;|&nbsp;&nbsp;&nbsp;" + leftArm + bodySpot + rightArm + "<br>";
    str += "&nbsp;|&nbsp;&nbsp;&nbsp;" + leftLeg + "&nbsp;" + rightLeg + "<br>";

    let divNode = document.createElement("Div");
    divNode.innerHTML = str;
    document.querySelector("#gameDiv").appendChild(divNode);

    return;
}

function setUpGame() {
    answer      = getRandomWord().split(''); // chooses a new word
    nWrong      = 0; // reset the total of wrong guesses
    pastGuesses = []; // empties our array of previously guessed letters
    guesses     = 0; // resets the total of guesses counter
}