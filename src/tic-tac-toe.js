// tic-tac-toe.js, module that contains the functions for the tic-tac-toe game.
/**
 * Adam Soliman
 */

function repeat(initVal, length) {
  return Array(length).fill(initVal);
}

function generateBoard(rows, cols, initialValue) {
  const blankValue = initialValue || " ";
  return repeat(blankValue, rows * cols);
}

/**
 * Returns a single dimensional Array representation of a Tic Tac Toe board based on the inputted string.
 * The length of the string should be a perfect square.
 * Only spaces ( ), X's and O's are in the string otherwise it will return null.
 * 
 * @param {String} s - string representation of the board.
 * @returns {Array} - single dimensional Array representation of the board.
 */
function boardFromString(s) {
  if (!Number.isInteger(Math.sqrt(s.length))) {
    return null; // Not a perfect square
  }
  const board = [];
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] !== "X" && s[i] !== "O" && s[i] !== " ") {
      return null; // Invalid character
    } else {
      board.push(s[i]);
    }
  }
  return board;
}

/**
 * This function translates a row and a column into an index in the one dimensional Array representation of a Tic Tac Toe board.
 * 
 * @param {Array} board - single dimensional Array representing the board.
 * @param {Number} row - row number
 * @param {Number} col - column number
 * @returns {Number} - index in the one dimensional Array representation of a Tic Tac Toe board.
 */
function rowColToIndex(board, row, col) {
  const num = Math.sqrt(board.length); // Number of rows and columns
  return row * num + col;
}
 
/**
 * Returns an object containing two properties, row and col, representing the row and column numbers that the index maps to.
 * @param {Array} board - single dimensional Array representing the board
 * @param {Number} i - index.
 * @returns {Object} - Object with row and col properties.
 */
function indexToRowCol(board, i) {
  const obj = {};
  const num = Math.sqrt(board.length); // Number of rows and columns
  obj.row = Math.floor(i / num);
  obj.col = i % num; // column index is the offset when divided by the number of columns
  return obj;
}

/**
 * Returns a shallow copy of the input Array representing the board where the cell at row and col is set to the value of letter.
  * @param {Array} board - single dimensional Array representing the board
  * @param {String} letter - X or O
  * @param {Number} row - row number
  * @param {Number} col - column number
  * @returns {Array} - shallow copy of the input Array representing the board where the cell at row and col is set to the value of letter.
 */
function setBoardCell(board, letter, row, col) {
  const index = rowColToIndex(board, row, col);
  const newBoard = board.slice(); // Shallow copy
  newBoard[index] = letter;
  return newBoard;
}

/**
 * Returns an object containing two properties, row and col, representing the row and column numbers that the algebraicNotation maps to.
 * Example input: A1, B7, C14, etc.
 * @param {String} algebraicNotation - A1, B7, C14, etc.
 * @returns {Object} - Object with row and col properties.
 * @example
 * (for example, {"row": 1, "col": 1})
 */
function algebraicToRowCol(algebraicNotation) {
  if (algebraicNotation === null || algebraicNotation.length <= 1 || algebraicNotation.length > 3) {
    return undefined;
  }
  const r = algebraicNotation[0];
  const c = algebraicNotation.slice(1);
  if (!isNaN(r) || r.charCodeAt() < 65 || r.charCodeAt() > 90 || isNaN(c)) {
    return undefined; // Invalid input
  }
  for (let i = 0; i < c.length; i += 1) {
    // Checks each letter of c for an invalid input. This is bc parseInt() has some odd behavior we have to account for.
    if (isNaN(c[i]) || c[i] === " ") {
      return undefined;
    }
  }
  const obj = {};
  obj.row = r.charCodeAt() - 65; // ASCII value of 'A' is 65
  obj.col = parseInt(c) - 1;
  return obj;
}

/**
 * Returns a single dimensional Array representing the board where the cell at row and col is set to the value of letter.
 * 
 * @param {Array} board - single dimensional Array representing the board
 * @param {String} letter - X or O
 * @param {String} algebraicNotation - A1, B7, C14, etc.
 * @returns {Array} - single dimensional Array representing the board where the cell at row and col is set to the value of letter.
 */
function placeLetter(board, letter, algebraicNotation) {
  const obj = algebraicToRowCol(algebraicNotation);
  if (obj === undefined) {
    return undefined;
  }
  return setBoardCell(board, letter, obj.row, obj.col);
}

/**
 * Examines the board for a winner and returns the winner if there is one.
 * 
 * @param {Array} board - single dimensional Array representing the board
 * @returns {String} - The letter of the winning player. If there is no winner, it returns undefined.
 */
function getWinner(board) {
  const num = Math.sqrt(board.length); // Number of rows and columns
  // Check columns
  for (let i = 0; i < num; i++) {
    const mySet = new Set(); // new set for each column to store unique values
    for (let n = i; n < board.length; n += num) {
      mySet.add(board[n]);
      if (mySet.size > 1) {
        break;
      }
    }
    if (mySet.size === 1) {
       if (mySet.has("X")) {
         return "X";
       } else if (mySet.has("O")) {
         return "O";
       }
    }
  }
  // Check rows
  for (let i = 0; i < board.length; i += num) {
    const mySet = new Set(); // new set for each row to store unique values
    for (let n = 0; n < num; n++) {
      mySet.add(board[i+n]);
      if (mySet.size > 1) {
        break;
      }
    }
    if (mySet.size === 1) {
       if (mySet.has("X")) {
         return "X";
       } else if (mySet.has("O")) {
         return "O";
       }
    }
  }
  // Check diagonal from top left to bottom right
  let mySet = new Set();
  for (let i = 0; i < board.length; i += num+1) {
    mySet.add(board[i]);
    if (mySet.size > 1) {
      break;
    }
  }
  if (mySet.size === 1) {
    if (mySet.has("X")) {
      return "X";
    } else if (mySet.has("O")) {
      return "O";
    }
  }
  mySet = new Set(); // get a new set for the other diagonal
  for (let i = num-1; i < board.length-1; i += num-1) {
    // I did the math you have to neglect the last index otherwise it'll mistakenly count
    mySet.add(board[i]);
    if (mySet.size > 1) {
      break;
    }
  }
  if (mySet.size === 1) {
    if (mySet.has("X")) {
      return "X";
    } else if (mySet.has("O")) {
      return "O";
    }
  }
  return undefined; // Failed all possible checks, no winner
}

/**
 * Determines if the board is full or not.
 * 
 * "Assume that the board uses the empty string , "", to mark a square as empty." But boardFromString() 
 * function uses " " to mark a square as empty??
 * @param {Array} board - single dimensional Array representing the board
 * @returns true if there are no empty cells left in the board, false otherwise
 */
function isBoardFull(board) {
  return !board.some(cell => cell === " "); // ! flip because if there is no empty cell, the board is full.
  // .some() returns true if one element passes the condition, if one cell is empty.
}

/**
 * Determines if the move is valid or not. * 
 * 
 * @param {Array} board - single dimensional Array representing the board
 * @param {String} algebraicNotation
 * @returns {String} - true if the move is valid, false otherwise
 */
function isValidMove(board, algebraicNotation) {
  const obj = algebraicToRowCol(algebraicNotation);
  if (obj === undefined) {
    return false;
  }
  const index = rowColToIndex(board, obj.row, obj.col);
  return board[index] === " ";
}


export {
  generateBoard,
  boardFromString,
  rowColToIndex,
  indexToRowCol,
  setBoardCell,
  algebraicToRowCol,
  placeLetter,
  getWinner,
  isBoardFull,
  isValidMove
};