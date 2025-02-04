// app.js
/* Adam Soliman */
import * as tic from './src/tic-tac-toe.js';
import { question } from 'readline-sync';
import { readFile } from 'fs'

main();
/**
 * Function that reads the inputted JSON file and starts the game if the file is valid.
 */
function main() {
    let fileName;
    if (process.argv.length < 3) {
        fileName = "defaultConfig.json";
    } else {
        fileName = process.argv[2];
    }
    readFile(fileName, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }
        const obj = JSON.parse(data);
        if (Object.hasOwn(obj, "computerMoves") && Object.hasOwn(obj, "playerLetter") 
            && Object.hasOwn(obj, "computerLetter") && Object.hasOwn(obj, "board") && !tic.isBoardFull(tic.boardFromString(obj.board))) {
            startGame(obj);
        } else {
            console.error("Invalid JSON file"); // Object must have all four properties and have empty space for the game setup to be valid.
        }
    });

}

let introScreen = true; // Used to display the Intro Screen message only once.

/**
 * Function that initiates the game.
 * 
 * @param {Object} obj - Object containing the game setup.
 */
function startGame(obj) {
    console.log("Welcome!");
    if (obj.computerMoves.length > 0) {
        console.log(`Computer will make the following moves: ${obj.computerMoves}`);
    }
    console.log(`Player is ${obj.playerLetter}, Computer is ${obj.computerLetter}\n`);
    let board = tic.boardFromString(obj.board);
    showBoard(board); // Show the initial board
    introScreen = false;
    let turn;
    if (obj.playerLetter === "X") { // Player goes first
        turn = 'p';
    } else { // Computer goes first
        turn = 'c';
    }
    playGame(board, obj, turn);
}

/**
 * Function that plays the game. The player and computer take turns until the game is over.
 * 
 * @param {Array} board - single dimensional Array representation of the board.
 * @param {Object} obj - Object containing the game setup.
 * @param {String} turn - String representing whose turn it is. One letter, either 'p' or 'c'.
 */
function playGame(board, obj, turn) {
    let cMoves = 0; // Tracks the number of premade computer moves
    if (turn === 'p') { // Player's turn
        let answer = question('What\'s your move?\n');
        while (!tic.isValidMove(board, answer)) {
            console.log("Invalid move. Try again.");
            answer = question('What\'s your move?\n');
        }
        board = tic.placeLetter(board, obj.playerLetter, answer); // Place the player's move
        showBoard(board);
        if (isGameOver(board, obj)) {
            return;
        } else {
            playGame(board, obj, 'c'); // Computer's turn
        }
    } else {
        question('Press <ENTER> to show computer\'s move...');
        let flag = true;
        if (cMoves < obj.computerMoves.length) {
            while (cMoves < obj.computerMoves.length && !tic.isValidMove(board, obj.computerMoves[cMoves])) {
                cMoves++; // While the computer has moves left and the move is invalid, try the next move
            }
            if (cMoves < obj.computerMoves.length) { // If the computer has a valid move
                board = tic.placeLetter(board, obj.computerLetter, obj.computerMoves[cMoves]);
                cMoves++;
                showBoard(board);
                if (isGameOver(board, obj)) {
                    return;
                } else {
                    playGame(board, obj, 'p'); // Player's turn
                }
                flag = false; // No need to randomly generate a move
            }
        }
        // Randomly generate the computer's move
        if (flag) {
            const index = computerMove(board);
            const coord = tic.indexToRowCol(board, index); // Convert the index to row,col
            board = tic.setBoardCell(board, obj.computerLetter, coord.row, coord.col);
            showBoard(board);
            if (isGameOver(board, obj)) {
                return;
            } else {
                playGame(board, obj, 'p'); // Player's turn
            }
        }
    }
}

/**
 * Function that checks if the game is over. If it is, it prints the result and returns true. Otherwise, it returns false.
 * @param {Array} board - single dimensional Array representation of the board.
 * @param {Object} obj - Object containing the game setup.
 * @returns true if the game is over (either through a win or a full board), false otherwise.
 */
function isGameOver(board, obj) {
    const result = tic.getWinner(board);
    if (result === obj.playerLetter) {
        console.log("You win!");
        return true;
    } else if (result === obj.computerLetter) {
        console.log("Computer wins!");
        return true;
    } else if (tic.isBoardFull(board)) {
        console.log("It's a draw!");
        return true;
    } else {
        return false;
    }
}

/**
 * Returns the index in the board array of the computer's next move. Will randomly find any open index in the array.
 * 
 * @param {Array} board - single dimensional Array representing the board
 * @returns {Number} - index of the computer's next move
 */
function computerMove(board) {
    let index = Math.floor(Math.random() * board.length);
    while (board[index] !== " ") {
        index = Math.floor(Math.random() * board.length);
    }
    return index;
}


/**
 * Function that prints out the input board.
 * 
 * @param {Array} board - single dimensional Array representation of the board.
 */
function showBoard(board) {
    if (!introScreen) {
        console.log('\x1Bc'); // ANSI escape code to clear the terminal screen.
    }
    let output = "  ";
    const num = Math.sqrt(board.length); // Number of rows and columns
    for (let i = 1; i < num+1; i++) { // Printing the column numbers
        output += `  ${i} `;
    }
    output += "\n  -";
    output += "-".repeat(num * 4) + "\n";
    for (let i = 0; i < num; i++) {
        output += `${String.fromCharCode(65 + i)} |`; // Printing the row letters
        for (let j = 0; j < num; j++) {
            output += ` ${board[tic.rowColToIndex(board, i, j)]} `;
            output += "|";
        }
        output += "\n  -";
        output += "-".repeat(num * 4) + "\n";
    }
    console.log(output);
}

