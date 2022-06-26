/* Global variables */

const numDigits = 12; // Total number of digits on screen
let decimalPressed = false; // Indicator for whether the decimal point button has been pressed
let decimalExists = false; // Indicator for whether the screen number contains a decimal point
let operationPressed = null; // Indicator for four basic operations. {0: +, 1: -, 2:*, 3:/}
let minusPressed = false; // Indicator for whether the +/- button has been pressed
let lhs = 0; // Left hand side of computation
let memoryNumber = null; // Number stored using memory functions
let resolved = false; // Indicator for whether an operation has just resolved and the result is displayed

/* Set up LCD screen */

const screen = document.getElementById('screen');

// Screen is made up of digits (odd-numbered divs) with decimal points in between (even-numbered divs)
// Note: divs are arranged in reverse, i.e. right to left
// Each digit is enclosed further in a span which is vertically centered by flexbox in the digit div

for (let i = 1; i <= numDigits*2; i++) {
  const charDiv = document.createElement('div');
  const char = document.createElement('span');
  if (i % 2 === 1) {
    charDiv.classList.add('digit');
    char.setAttribute('id',`digit${Math.ceil(i/2)}`);
    if (i === 1) char.textContent = '0'; // By default display 0 at the first digit
  } else {
    charDiv.classList.add('decimal-point');
    char.setAttribute('id',`point${i/2}`);
  }
  charDiv.appendChild(char);
  screen.appendChild(charDiv);
}

// Left most div for minus sign

const charDiv = document.createElement('div');
const char = document.createElement('span');
charDiv.classList.add('digit');
char.setAttribute('id','minus-sign');
charDiv.appendChild(char)
screen.appendChild(charDiv);

/* Set up buttons */

const allSymbols = ['MC','MR','M-','M+','\u00f7','+/-','7','8','9','\u00d7','C','4','5','6','-','AC','1','2','3','+','0','00','.','='];
const buttons = document.getElementById('buttons');

// Function to convert button strings to unicode for id, as not all symbols are allowed values for id
// Function converts each character in string to its unicode

function convertUnicode(string) {
  const stringArray = string.split('');
  return stringArray.map(e => e.charCodeAt(0)).reduce((totalString,charCode) => totalString + charCode, 'u');
}

for (let i = 0; i < allSymbols.length; i++) {
  const symb = allSymbols[i];
  const buttonElement = document.createElement('button');
  buttonElement.classList.add(`col${i % 5}`);
  buttonElement.setAttribute('id',`${convertUnicode(symb)}`);
  buttonElement.textContent = symb;
  buttons.appendChild(buttonElement);
}

/******* Inputs *******/

/* Numbers */

for (let i = 48; i <= 57; i++) {
  const digitButton = document.getElementById(`u${i}`);
  digitButton.addEventListener('click',() => inputNumber(digitButton.textContent));
  digitButton.classList.add('number-key');
}

// Keyboard input

for (let i = 0; i <= 9; i++) {
  document.addEventListener('keyup',(e) => {if(e.key === String(i)) inputNumber(String(i));});
}

function inputNumber(text) {
  // If an operation has just resolved, the resolved result is showing. Hence clear the screen for a new input instead of modifying resolved result
  if (resolved) {
    clear(resetDecimalPress = false); // Keep decimal press indicator in order to put decimal point at the first digit later in the function
    resolved = false;
    // If - was pressed after an operation resolved, - should be tagged onto the new input
    if (minusPressed) {
      toggleMinusSign();
      minusPressed = false;
    }
  }
  // Loop through number displays starting from leftmost one
  for (let i = numDigits; i >= 1; i--) {
    const digit = document.getElementById(`digit${i}`);
    if (i === numDigits && !!digit.textContent) return; // If the leftmost digit is non-blank, display is full
    // For each non-blank digit
    if (!!digit.textContent) {

      const decimalPoint = document.getElementById(`point${i}`);

      // Move decimal point one spot left if it is present
      if (decimalPoint.textContent) {
        toggleDecimalPoint(i);
        toggleDecimalPoint(i+1);
      }

      const nextDigit = document.getElementById(`digit${i+1}`);

      // Special treatment for first digit
      if (i === 1) {
        // If decimal is pressed, or if display is just not just '0', then move the first digit left one spot. If it's just '0', don't move it (unless decimal was pressed)
        if (nextDigit.textContent || digit.textContent !== '0' || decimalPressed) {
          nextDigit.textContent = digit.textContent;
        }
        digit.textContent = text; // First digit is replaced with pressed number
        // If decimal is pressed, put decimal point at first spot 
        // Note: toggleDecimalPoint will not trigger if decimal point already exists
        if (decimalPressed) {
          toggleDecimalPoint(1);
          decimalExists = true;
          decimalPressed = false;
        }
      } else {
        nextDigit.textContent = digit.textContent; // For all other digits, just move it left one spot
      }
    };
  }
}

const digitButton = document.getElementById('u4848');
digitButton.addEventListener('click',() => inputDoubleZero());
digitButton.classList.add('number-key');

// See comments for function inputNumber. Very similar except digits and decimal points are moved two spots down

function inputDoubleZero() {
  if (resolved) {
    clear(resetDecimalPress = false);
    resolved = false;
    if (minusPressed) {
      toggleMinusSign();
      minusPressed = false;
    }
  }
  for (let i = numDigits - 1; i >= 1; i--) {
    const digit = document.getElementById(`digit${i}`);
    if (i === numDigits - 1 && !!digit.textContent) return;
    if (!!digit.textContent) {

      const decimalPoint = document.getElementById(`point${i}`);

      if (decimalPoint.textContent) {
        toggleDecimalPoint(i);
        toggleDecimalPoint(i+2);
      }

      const nextDigit = document.getElementById(`digit${i+2}`);
      
      if (i === 1) {
        const secondDigit = document.getElementById('digit2');
        if (secondDigit.textContent || digit.textContent !== '0' || decimalPressed) {
          nextDigit.textContent = digit.textContent;
          secondDigit.textContent = '0';
          digit.textContent = '0';
        }
        if (decimalPressed) {
          toggleDecimalPoint(2);
          decimalExists = true;
          decimalPressed = false;
        }
      } else {
        nextDigit.textContent = digit.textContent;
      }
    };
  }
}

/* Decimal point */

const decimalPointButton = document.getElementById('u46');
decimalPointButton.addEventListener('click', () => addDecimalPoint());
decimalPointButton.classList.add('number-key');
document.addEventListener('keyup', (e) => {if (e.key === '.') addDecimalPoint();});

// Add decimal point only if it doesn't already exist

function addDecimalPoint() {
  if (decimalExists) return;
  decimalPressed = true;
  decimalExists = true;
  return;
}

/* Minus sign */

const minusSignButton = document.getElementById('u434745');
minusSignButton.addEventListener('click', () => pressMinusSign());

// Toggle left-most digit (minus sign) on or off

function toggleMinusSign() {
  const minusSign = document.getElementById('minus-sign');
  if (!minusSign.textContent) minusSign.textContent = '-';
  else minusSign.textContent = null;
  return;
}

// If operation has just resolved, set minusPressed to true to tag on to new input instead of modifying resolved output

function pressMinusSign() {
  if (resolved && operationPressed != null) minusPressed = true;
  else toggleMinusSign();
  return;
}

// Toggle decimal point at position num on or off

function toggleDecimalPoint(num) {
  const decimalPoint = document.getElementById(`point${num}`);
  if (!decimalPoint.textContent) decimalPoint.textContent = '.';
  else decimalPoint.textContent = null;
  return;
}

/* Clear buttons */

const clearButton = document.getElementById('u67');
clearButton.addEventListener('click', () => clear());
document.addEventListener('keyup', (e) => {if (e.key === 'Backspace') clear();});

// Reset current display to '0', but does not reset current computation. E.g. left hand side and operation pressed are still remembered

function clear(resetDecimalPress = true) {
  const allDigits = document.querySelectorAll('.digit, .decimal-point');
  allDigits.forEach(e => e.textContent = null);
  document.getElementById('digit1').textContent = '0';
  if (resetDecimalPress) decimalPressed = false; // Option to not reset decimalPressed, for the inputNumber function
  decimalExists = false;
  minusPressed = false;
  return;
}

const allClearButton = document.getElementById('u6567');
allClearButton.addEventListener('click', () => allClear());
document.addEventListener('keyup', (e) => {if (e.key === 'Delete') allClear();});

// Clear everything, including incomplete computations. Does not affect memory functions

function allClear() {
  clear();
  operationPressed = null;
  lhs = 0;
  resolved = false;
  return;
}

/* Operations */

// Function to count decimal places for a given number

function countDecimalPlaces(num) {
  let numString = String(num);

  // parseInt does not convert exponential to decimal notation for negative exponents
  if (numString.indexOf('e-') > 0) {
    return parseInt(numString.split('e-')[1]);
  }

  // 0 decimal places if decimal place not found
  if (numString.indexOf('.') < 0) return 0;
  return numString.length - numString.indexOf('.') - 1;
}

function add(a,b) {
  // Ensure accuracy of float arithmetic
  maxDecimalPlaces = Math.max(countDecimalPlaces(a),countDecimalPlaces(b));
  return Math.round((a + b)*10**maxDecimalPlaces)/10**maxDecimalPlaces;
}

function subtract(a,b) {
  // Ensure accuracy of float arithmetic
  maxDecimalPlaces = Math.max(countDecimalPlaces(a),countDecimalPlaces(b));
  return Math.round((a - b)*10**maxDecimalPlaces)/10**maxDecimalPlaces;
}

function multiply(a,b) {
  return a * b;
}

function divide(a,b) {
  return a / b;
}

const operations = [add,subtract,multiply,divide];

// Returns number currently displayed on screen

function screenToNumber() {
  const allDigits = [...document.querySelectorAll('.digit, .decimal-point')];
  digitsArray = allDigits.map(e => e.textContent);
  return parseFloat(digitsArray.reverse().join('')); // reverse() required because digit divs are laid out in reverse
}

// Displays string on screen

function displayString(string) {
  const reverseStringArray = string.split('').reverse(); // reverse() required because digit divs are laid out in reverse
  for (let i = 1; i <= reverseStringArray.length; i++) {
    document.getElementById(`digit${i}`).textContent = reverseStringArray[i - 1];
  }
  return;
}

// Displays number on screen

function numberToScreen(num) {
  // Keep digits to display within numDigits
  roundedNum = parseFloat(num.toFixed(numDigits - 1)); // At most numDigits - 1 decimal places (rounds very small numbers like 1e-15 to 0)
  truncNum = parseFloat(roundedNum.toPrecision(numDigits)); // At most numDigits significant figures
  const numString = truncNum.toFixed(countDecimalPlaces(truncNum)); // Expands exponential notation, otherwise does nothing if already in decimal form
  let numStringClean = numString.replace(/[.,-]/g,''); // String with only the digits
  const decimalLocation = numStringClean.length - numString.indexOf('.') + numString.indexOf('-') + 1; // Counts which decimal point to toggle

  clear(); 

  // If number too large, display 'ERROR'
  if (Math.abs(num) >= 10**numDigits) {
    displayString('ERROR');
    return;
  }

  // Add - and . if necessary to the display then display the digits
  if (truncNum < 0) toggleMinusSign();
  if (numString.indexOf('.') > 0) toggleDecimalPoint(decimalLocation);
  displayString(numStringClean);
}

// Given a pressed operation and a left-hand side, perform the operation with the number on screen as the right-hand side, and display the resolved result

function resolveOperation() {
  if (operationPressed != null) {
    lhs = operations[operationPressed](lhs,screenToNumber());
    numberToScreen(lhs);
    resolved = true;
  }
  return;
}

const equalButton = document.getElementById('u61');
equalButton.addEventListener('click', () => equalOperation());
document.addEventListener('keyup', (e) => {if(e.key === 'Enter') equalOperation();});

function equalOperation() {
  resolveOperation();
  operationPressed = null;
  return;
}

const operationButtonIds = ['u43','u45','u215','u247']; // +, -, *, / in order
const operationKeyboard = ['+','-','*','/'];

for (let i = 0; i <= 3; i++) {
const operationButton = document.getElementById(operationButtonIds[i]);

// When operation is pressed, resolve any existing computation, store result as the left-hand side and store the operation pressed to await the right-hand side input

const operationFunction = () => {
  if (!resolved) resolveOperation(); // Don't resolve successive operation presses, only when some input has been entered in between
  operationPressed = i;
  resolved = true;
  lhs = screenToNumber();
  return;
}

operationButton.addEventListener('click', operationFunction);
document.addEventListener('keyup', (e) => {if(e.key === operationKeyboard[i]) operationFunction();}); // Keyboard input
}

/* Memory functions */

const memoryPlusButton = document.getElementById('u7743');
memoryPlusButton.addEventListener('click', () => memoryPlus());

function memoryPlus() {
  memoryNumber += screenToNumber();
  resolved = true;
  return;
}

const memoryMinusButton = document.getElementById('u7745');
memoryMinusButton.addEventListener('click', () => memoryMinus());

function memoryMinus() {
  memoryNumber -= screenToNumber();
  resolved = true;
  return;
}

const memoryRevealButton = document.getElementById('u7782');
memoryRevealButton.addEventListener('click', () => memoryReveal());

function memoryReveal() {
  if (memoryNumber != null) {
    resolved = true;
    numberToScreen(memoryNumber);
  }
  return;
}

const memoryClearButton = document.getElementById('u7767');
memoryClearButton.addEventListener('click', () => memoryClear());

function memoryClear() {
  memoryNumber = null;
  return;
}