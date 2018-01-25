const readlineSync = require('readline-sync');

// Array of words to be guessed
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
let pastGames 	= [];
let cont 		= true;


// End of game Constructor Function
function GameOver(win, pastGuesses, word) {
	let winLose = "Win";

	if (win == true) {
		winLose = "Won";
	} else {
		winLose = "Lost";
	}

	this.winLose 		= winLose;
	this.pastGuesses 	= pastGuesses;
	this.word			= word.join("");

	return {
		"winLose": this.winLose,
		"pastGuesses": this.pastGuesses,
		"word": this.word,
		"guesses": (this.pastGuesses).length
	};
}


function startGame() {
	setUpGame();

	console.log("\033c");

	/* Output previous game results to console */
	for (var i = 0; i < pastGames.length; i++) {

		let winLose 		= pastGames[i].winLose;
		let previousGuesses = pastGames[i].pastGuesses;
		let word			= pastGames[i].word;
		let numGuesses 		= pastGames[i].guesses;

		let str = `Game ${i + 1} -> ${winLose} | Actual Word: ${word} | `;
		str += `Guesses: ${previousGuesses} | Number of Guesses: ${numGuesses}`;

		console.log(str);

		if (i + 1 == pastGames.length) {
			console.log("\n");
		}
	}

	while (!checkGameOver()) {
		printGameState();

		const guess = readlineSync.question("Please enter a guess (a-z): ");
		console.log("guess is", guess);

		if (!(guess.match(/[a-z]/i))) {
			console.log("That is not a valid character. Please select from a-z");
		} else if (guess.length > 1) {
			console.log("Please enter only 1 letter at a time.");
		} else if (pastGuesses.includes(guess)) {
			console.log("You have already tried this letter.");
		} else {
			pastGuesses.push(guess);

			if (!answer.includes(guess)) {
				nWrong += 1;
			}
		}
	}
	printGameState();

	if (checkGameOver()) {
		let win = false;

		if (nWrong <= 5) {
			win = true;

			console.log("You win!");
		} else {
			console.log("You have reached the maximum number of guesses (6).");
		}

		let retObj = new GameOver(win, pastGuesses, answer);

		pastGames.push(retObj);
	}
}


function checkGameOver() {
	let slicedAnswer = answer.slice(0);

	let uniqueAnswer = slicedAnswer.filter(function (elem, index, self) {
		return index == self.indexOf(elem);
	});

	let result = uniqueAnswer.filter(function (elem) {
		return pastGuesses.indexOf(elem) > -1;
	}).length == uniqueAnswer.length;

	if (nWrong == 6 || result == true) {
		return true;
	}
	return false;
}


function printGameState() {

	if (pastGuesses.length !== 0) {
		console.log(`\nPrevious Guesses: ${pastGuesses}`);
	}

	console.log(`Number of Guesses remaining: ${6 - nWrong}`);
	console.log("\n");

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
	console.log(str);

	console.log("\n");
	printHangMan(nWrong);
	console.log("\n\n");
}


function getRandomWord() {
	const index = Math.floor(Math.random() * words.length);

	return words[index];
}


function printHangMan(nWrong) {
	const headSpot 	= (nWrong > 0) ? "O" : " ";
	const bodySpot 	= (nWrong > 1) ? "|" : " ";
	const leftArm 	= (nWrong > 2) ? "/" : " ";
	const rightArm 	= (nWrong > 3) ? "\\" : " ";
	const leftLeg 	= (nWrong > 4) ? "/" : " ";
	const rightLeg 	= (nWrong > 5) ? "\\" : " ";

	let str = "";
	console.log(" ___ ");
	console.log(" |  | ");
	console.log(" |  " + headSpot + " ");
	console.log(" | " + leftArm + bodySpot + rightArm);
	console.log(" | " + leftLeg + " " + rightLeg);
	return;
}

function setUpGame() {
	answer 		= getRandomWord().split(''); // chooses a new word
	nWrong 		= 0; // resets the total of wrong guesses
	pastGuesses = []; // empties array of previously guessed letters
}

startGame();

while (cont) {
	let answer = readlineSync.question("Would you like to play again? y/n: ");

	if (answer.toLowerCase() === 'y') {
		startGame();
	} else if (answer.toLowerCase() === 'n') {
		cont = false;

		console.log("Good game!");
	} else {
		console.log("Please enter either y (yes) or n (no).");
	}
}