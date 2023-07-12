let string = "";
const container = document.querySelector(".container");

container.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("button")) {
    const clickedButton = target;
    const buttonValue = clickedButton.innerHTML;

    if (buttonValue === "=") {
      const result = calculateExpression(string);
      document.querySelector("input").value = result;
    } else if (buttonValue === "C") {
      string = "";
      document.querySelector("input").value = string;
    } else {
      string += buttonValue;
      document.querySelector("input").value = string;
    }
  }
});

function calculateExpression(expression) {
  const operators = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
  };

  const outputQueue = [];
  const operatorStack = [];

  const tokens = expression.match(/\d+(\.\d+)?|[+\-*/%()]/g);

  tokens.forEach((token) => {
    if (!operators[token] && token !== "(" && token !== ")") {
      outputQueue.push(parseFloat(token));
    } else {
      while (
        operatorStack.length > 0 &&
        (operators[token] <=
          operators[operatorStack[operatorStack.length - 1]] ||
          (token === ")" && operatorStack[operatorStack.length - 1] !== "("))
      ) {
        const operator = operatorStack.pop();
        outputQueue.push(operator);
      }

      if (token === ")") {
        operatorStack.pop();
      } else {
        operatorStack.push(token);
      }
    }
  });

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  const result = evaluateRPN(outputQueue);
  return result;
}

// Evaluating the expression in Reverse Polish Notation (RPN)
function evaluateRPN(tokens) {
  const stack = [];

  tokens.forEach((token) => {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const operand2 = stack.pop();
      const operand1 = stack.pop();
      let result;

      switch (token) {
        case "+":
          result = operand1 + operand2;
          break;
        case "-":
          result = operand1 - operand2;
          break;
        case "*":
          result = operand1 * operand2;
          break;
        case "/":
          result = operand1 / operand2;
          break;
        case "%":
          result = operand1 % operand2;
          break;
        default:
          throw new Error("Invalid operator");
      }

      stack.push(result);
    }
  });

  const finalResult = stack.pop();
  return isDecimal(finalResult) ? finalResult.toFixed(2) : finalResult;
}

function isDecimal(number) {
  return number % 1 !== 0;
}
