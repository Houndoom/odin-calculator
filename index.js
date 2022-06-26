function countDecimalPlaces(num) {
  let numString = String(num);
  if (numString.indexOf('e-') > 0) {
    return parseInt(numString.split('e-')[1]);
  }
  if (numString.indexOf('.') < 0) return 0;
  return numString.length - numString.indexOf('.') - 1;
}

function add(a,b) {
  maxDecimalPlaces = Math.max(countDecimalPlaces(a),countDecimalPlaces(b));
  return Math.round((a + b)*10**maxDecimalPlaces)/10**maxDecimalPlaces;
}

function subtract(a,b) {
  maxDecimalPlaces = Math.max(countDecimalPlaces(a),countDecimalPlaces(b));
  return Math.round((a - b)*10**maxDecimalPlaces)/10**maxDecimalPlaces;
}

function multiply(a,b) {
  return a * b;
}

function divide(a,b) {
  return a / b;
}

/* Set up LCD screen */

const numDigits = 13;
let decimalPressed = false;
let decimalExists = false;
let operationPressed = null;
let minusPressed = false;
let currentNumber = 0;
let memoryNumber = null;
let resolved = false;
const operations = [add,subtract,multiply,divide];

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
  if (resolved) {
    clear(resetDecimalPress = false);
    resolved = false;
    if (minusPressed) {
      toggleMinusSign();
      minusPressed = false;
    }
  }
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
        if (nextDigit.textContent || digit.textContent !== '0' || decimalPressed) {
          nextDigit.textContent = digit.textContent;
        }
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
minusSignButton.addEventListener('click', () => pressMinusSign());

function toggleMinusSign() {
  const minusSign = document.getElementById('minus-sign');
  if (!minusSign.textContent) minusSign.textContent = '-';
  else minusSign.textContent = null;
  return;
}

function pressMinusSign() {
  if (resolved && operationPressed != null) minusPressed = true;
  else toggleMinusSign();
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

function clear(resetDecimalPress = true) {
  const allDigits = document.querySelectorAll('.digit, .decimal-point');
  allDigits.forEach(e => e.textContent = null);
  document.getElementById('digit1').textContent = '0';
  if (resetDecimalPress) decimalPressed = false;
  decimalExists = false;
  minusPressed = false;
  return;
}

const allClearButton = document.getElementById('u6567');
allClearButton.addEventListener('click', () => allClear());

function allClear() {
  clear();
  operationPressed = null;
  currentNumber = 0;
  resolved = false;
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
  roundedNum = parseFloat(num.toFixed(numDigits - 1));
  truncNum = parseFloat(roundedNum.toPrecision(numDigits));
  const numString = truncNum.toFixed(countDecimalPlaces(truncNum));
  let numStringClean = numString.replace(/[.,-]/g,'');
  const decimalLocation = numStringClean.length - numString.indexOf('.') + numString.indexOf('-') + 1;

  clear(); 

  if (Math.abs(num) >= 10**numDigits) {
    displayString('ERROR');
    return;
  }

  if (truncNum < 0) toggleMinusSign();
  if (numString.indexOf('.') > 0) toggleDecimalPoint(decimalLocation);
  displayString(numStringClean);
}

function resolveOperation() {
  if (operationPressed != null) {
    currentNumber = operations[operationPressed](currentNumber,screenToNumber());
    numberToScreen(currentNumber);
    resolved = true;
  }
  return;
}

const equalButton = document.getElementById('u61');
equalButton.addEventListener('click', () => equalOperation());

function equalOperation() {
  resolveOperation();
  operationPressed = null;
  return;
}

const operationButtonIds = ['u43','u45','u215','u247'];

for (let i = 0; i <= 3; i++) {
const operationButton = document.getElementById(operationButtonIds[i]);
operationButton.addEventListener('click', function() {
  if (operationPressed != null) resolveOperation();
  operationPressed = i;
  resolved = true;
  currentNumber = screenToNumber();
  return;
});
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