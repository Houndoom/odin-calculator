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

const numDigits = 15;

const screen = document.querySelector('#screen');

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
const buttons = document.querySelector('#buttons');

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

/* Input numbers */

for (let i = 48; i <= 57; i++) {
  const button = document.querySelector(`#u${i}`);
  button.addEventListener('click',() => inputNumber(button.textContent));
}

function inputNumber(text) {
  for (let i = numDigits; i >= 1; i--) {
    const digit = document.querySelector(`#digit${i}`);
    if (i === numDigits && !!digit.textContent) return;
    if (!!digit.textContent) {
      const nextDigit = document.querySelector(`#digit${i+1}`);
      if (i === 1) {
        if (nextDigit.textContent || digit.textContent !== '0') nextDigit.textContent = digit.textContent;
        digit.textContent = text;
      } else {
        document.querySelector(`#digit${i+1}`).textContent = digit.textContent;
      }
    };
  }
}