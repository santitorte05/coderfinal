const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
  };
  
  function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
  }
  
  function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
  
    if (waitingForSecondOperand) {
      calculator.displayValue = digit;
      calculator.waitingForSecondOperand = false;
    } else {
      calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
  
    updateDisplay();
  }
  
  function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return;
    if (!calculator.displayValue.includes(dot)) {
      calculator.displayValue += dot;
    }
    updateDisplay();
  }
  
  function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
  
    if (operator && calculator.waitingForSecondOperand) {
      calculator.operator = nextOperator;
      console.log(calculator);
      return;
    }
  
    if (firstOperand == null && !isNaN(inputValue)) {
      calculator.firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      calculator.displayValue = String(result);
      calculator.firstOperand = result;
      updateDisplay();
    }
  
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    console.log(calculator);
  }
  
  function handleEqual() {
    const { firstOperand, displayValue, operator } = calculator;
    if (operator === null || calculator.waitingForSecondOperand) {
      return;
    }
    const currentValue = parseFloat(displayValue);
    const result = calculate(firstOperand, currentValue, operator);
    console.log("Resultado calculado:", result); 
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
    calculator.waitingForSecondOperand = true;
    updateDisplay();
  
   
    saveResultToLocalStorage(result);
  }
  
  function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }
  
  const keys = document.querySelector('.calculator-keys');
  keys.addEventListener('click', (event) => {
    const { target } = event;
  
    if (!target.matches('button')) {
      return;
    }
  
    if (target.classList.contains('operator')) {
      console.log('operator', target.value);
      handleOperator(target.value);
      return;
    }
  
    if (target.classList.contains('decimal')) {
      console.log('decimal', target.value);
      inputDecimal(target.value);
      return;
    }
  
    if (target.classList.contains('all-clear')) {
      console.log('clear', target.value);
      resetCalculator();
      return;
    }
  
    if (target.classList.contains('equal-sign')) {
      console.log('equal-sign', target.value);
      handleEqual();
      return;
    }
  
    console.log('digit', target.value);
    inputDigit(target.value);
  });
  
  function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updateDisplay();
  }
  
  
  function saveResultToLocalStorage(result) {
    let results = localStorage.getItem('results');
    if (!results) {
      results = [];
    } else {
      results = JSON.parse(results);
    }
    results.push(result);
    localStorage.setItem('results', JSON.stringify(results));
  }
  
  
  function loadResultsFromLocalStorage() {
    const results = localStorage.getItem('results');
    return results ? JSON.parse(results) : [];
  }
  
 
  document.addEventListener('DOMContentLoaded', () => {
    const results = loadResultsFromLocalStorage();
    const historicoLista = document.querySelector('.historico-lista');
    historicoLista.innerHTML = results.map(result => `<li>${result}</li>`).join('');
  });
  
 
  keys.addEventListener('click', saveCalculatorState);
  
  
  document.addEventListener('DOMContentLoaded', loadCalculatorState);
  