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

const numDigits = 14;
let decimalPressed = false;
let decimalExists = false;

const screen = document.getElementById('screen');

for (let i = 1; i <= numDigits*2 - 1; i++) {
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

/* Set up buttons */

const allSymbols = ['MC','MR','M-','M+','\u00f7','+/-','7','8','9','\u00d7','C','4','5','6','-','AC','1','2','3','+','0','00','.','='];
const buttons = document.getElementById('buttons');

for (let i = 0; i < allSymbols.length; i++) {
  const symb = allSymbols[i];
  const buttonElement = document.createElement('button');
  buttonElement.classList.add(`col${i % 5}`);
  buttonElement.textContent = symb;
  if (symb.length === 1) {
    buttonElement.setAttribute('id',`u${symb.charCodeAt(0)}`);
  } else {
    buttonElement.setAttribute('id',`u${symb.charCodeAt(0)}${symb.charCodeAt(1)}`);
  }
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
      const decimalPointNext = document.getElementById(`point${i+1}`);

      if (decimalPoint.textContent) {
        decimalPoint.textContent = null;
        decimalPointNext.textContent = '.';
      }

      const nextDigit = document.getElementById(`digit${i+1}`);

      if (i === 1) {
        if (nextDigit.textContent || digit.textContent !== '0' || decimalPressed) nextDigit.textContent = digit.textContent;
        digit.textContent = text;
        if (decimalPressed) {
          decimalPoint.textContent = '.';
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
      const decimalPointNext = document.getElementById(`point${i+2}`);

      if (decimalPoint.textContent) {
        decimalPoint.textContent = null;
        decimalPointNext.textContent = '.';
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
          document.getElementById('point2').textContent = '.';
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
decimalPointButton.addEventListener('click',() => addDecimalPoint());

function addDecimalPoint() {
  if (decimalExists) return;
  decimalPressed = true;
  decimalExists = true;
  return;
}

/* Clear buttons */

const clearButton = document.getElementById('u67');
clearButton.addEventListener('click',() => clear());

function clear() {
  const allButtons = document.querySelectorAll('.digit, .decimal-point');
  allButtons.forEach(e => e.textContent = null);
  document.getElementById('digit1').textContent = '0';
  decimalPressed = false;
  decimalExists = false;
  return;
}