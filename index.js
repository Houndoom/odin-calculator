function add(a,b) {
  return a + b;
}

function subtract(a,b) {
  return a - b;
}

function multiply(a,b) {
  return a * b;
}

function divide(a,b) {
  return a / b;
}

function operate(func,a,b) {
  return func(a,b);
}

/* Set up LCD screen */

const numDigits = 13;
let decimalPressed = false;
let decimalExists = false;
let plusPressed = false;
let minusPressed = false;
let timesPressed = false;
let dividePressed = false;
let currentNumber = 0;

const screen = document.getElementById('screen');

for (let i = 1; i <= numDigits*2; i++) {
  const char = document.createElement('div');
  if (i % 2 === 1) {
    char.classList.add('digit');
    char.setAttribute('id',`digit${Math.ceil(i/2)}`);
    if (i === 1) char.textContent = '0';
  } else {
    char.classList.add('decimal-point');
    char.setAttribute('id',`point${i/2}`);
  }
  screen.appendChild(char);
}

const char = document.createElement('div');
char.classList.add('digit');
char.setAttribute('id','minus-sign');
screen.appendChild(char);

/* Set up buttons */

const allSymbols = ['MC','MR','M-','M+','\u00f7','+/-','7','8','9','\u00d7','C','4','5','6','-','AC','1','2','3','+','0','00','.','='];
const buttons = document.getElementById('buttons');

function convertUnicode(string) {
  const stringArray = string.split('');
  return stringArray.map(e => e.charCodeAt(0)).reduce((totalString,charCode) => totalString + charCode, 'u');
}

for (let i = 0; i < allSymbols.length; i++) {
  const symb = allSymbols[i];
  const buttonElement = document.createElement('button');
  buttonElement.classList.add(`col${i % 5}`);
  buttonElement.textContent = symb;
  buttonElement.setAttribute('id',`${convertUnicode(symb)}`);
  buttons.appendChild(buttonElement);
}

/******* Inputs *******/

/* Numbers */

for (let i = 48; i <= 57; i++) {
  const digitButton = document.getElementById(`u${i}`);
  digitButton.addEventListener('click',() => inputNumber(digitButton.textContent));
}

function inputNumber(text) {
  for (let i = numDigits; i >= 1; i--) {
    const digit = document.getElementById(`digit${i}`);
    if (i === numDigits && !!digit.textContent) return;
    if (!!digit.textContent) {

      /* Move decimal point */
      const decimalPoint = document.getElementById(`point${i}`);

      if (decimalPoint.textContent) {
        toggleDecimalPoint(i);
        toggleDecimalPoint(i+1);
      }

      const nextDigit = document.getElementById(`digit${i+1}`);

      if (i === 1) {
        if (nextDigit.textContent || digit.textContent !== '0' || decimalPressed) nextDigit.textContent = digit.textContent;
        digit.textContent = text;
        if (decimalPressed) {
          toggleDecimalPoint(1);
          decimalExists = true;
          decimalPressed = false;
        }
      } else {
        nextDigit.textContent = digit.textContent;
      }
    };
  }
}

const digitButton = document.getElementById('u4848');
digitButton.addEventListener('click',() => inputDoubleZero());

function inputDoubleZero() {
  for (let i = numDigits - 1; i >= 1; i--) {
    const digit = document.getElementById(`digit${i}`);
    if (i === numDigits - 1 && !!digit.textContent) return;
    if (!!digit.textContent) {

      /* Move decimal point */
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

function addDecimalPoint() {
  if (decimalExists) return;
  decimalPressed = true;
  decimalExists = true;
  return;
}

/* Minus sign */

const minusSignButton = document.getElementById('u434745');
minusSignButton.addEventListener('click', () => toggleMinusSign());

function toggleMinusSign() {
  const minusSign = document.getElementById('minus-sign');
  if (!minusSign.textContent) minusSign.textContent = '-';
  else minusSign.textContent = null;
  return;
}

function toggleDecimalPoint(num) {
  const decimalPoint = document.getElementById(`point${num}`);
  if (!decimalPoint.textContent) decimalPoint.textContent = '.';
  else decimalPoint.textContent = null;
  return;
}

/* Clear buttons */

const clearButton = document.getElementById('u67');
clearButton.addEventListener('click', () => clear());

function clear() {
  const allDigits = document.querySelectorAll('.digit, .decimal-point');
  allDigits.forEach(e => e.textContent = null);
  document.getElementById('digit1').textContent = '0';
  decimalPressed = false;
  decimalExists = false;
  return;
}

/* Operations */

function screenToNumber() {
  const allDigits = [...document.querySelectorAll('.digit, .decimal-point')];
  digitsArray = allDigits.map(e => e.textContent);
  return parseFloat(digitsArray.reverse().join(''));
}

function displayString(string) {
  const reverseStringArray = string.split('').reverse();
  for (let i = 1; i <= reverseStringArray.length; i++) {
    document.getElementById(`digit${i}`).textContent = reverseStringArray[i - 1];
  }
  return;
}

function numberToScreen(num) {
  const numString = String(num);
  let numStringClean = numString.replace(/[.,-]/g,'');
  if (numStringClean.length > numDigits) numStringClean = numStringClean.slice(0,numDigits);
  const decimalLocation = numStringClean.length - numString.indexOf('.') + 1;

  clear(); 

  if (Math.abs(num) >= 10**numDigits) {
    displayString('ERROR');
    return;
  }

  if (num < 0) toggleMinusSign();
  if (numString.indexOf('.') > 0) toggleDecimalPoint(decimalLocation);
  displayString(numStringClean);
}

const addButton = document.getElementById('u43');
addButton.addEventListener('click', () => add());

function add() {
  if (currentNumber) {
    currentNumber += screenToNumber();
    plusPressed = true;
  }
}