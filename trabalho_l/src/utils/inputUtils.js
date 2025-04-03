const readline = require('readline');

/**
 * Creates a readline interface for user input
 * @returns {readline.Interface} The readline interface
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Prompts the user for input and returns the answer
 * @param {readline.Interface} rl - The readline interface
 * @param {string} question - The question to ask
 * @returns {Promise<string>} The user's answer
 */
function prompt(rl, question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

module.exports = {
  createReadlineInterface,
  prompt
};