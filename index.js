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
const allSymbols = ['MC','M+','\u00f7','\u00d7','7','8','9','-','4','5','6','+','1','2','3','=','0','.'];
const buttons = document.querySelector('#buttons');

for (const i of allSymbols) {
  const buttonElement = document.createElement('button');
  if (!['=','0'].includes(i)) buttonElement.classList.add('normal-button');
  buttonElement.textContent = i;
  buttonElement.setAttribute('id',`u${i.charCodeAt(0)}`);
  buttons.appendChild(buttonElement);
}