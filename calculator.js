// Global variables for calculator
let variables = [];
let history = [];

//function for filling the values in the table....
const createTableRow = (data, tableBody, dataArray) => {
  const row = document.createElement("tr");

  const expressionCell = document.createElement("td");
  expressionCell.textContent = data.expression || data.var;
  expressionCell.classList.add("pointer");
  // Add a click event listener to the expressionCell
  expressionCell.addEventListener("click", function () {
    const expressionInput = document.getElementById("expressionInput");
    expressionInput.value = this.textContent; // Set the clicked expression as the input value
  });

  const valueCell = document.createElement("td");
  valueCell.textContent = data.value;

  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", function () {
    // Remove the row from the table
    row.remove();

    // Find the index of the item to be removed in the dataArray
    const index = dataArray.findIndex((item) => item.var === data.var);
    console.log("index is : ", index);
    // If the index is found, remove the item from the dataArray using splice
    if (index !== -1) {
      dataArray.splice(index, 1);
    }
    console.log("row is", data);
    console.log("arr becomes", dataArray);
  });

  deleteCell.appendChild(deleteButton);

  row.appendChild(expressionCell);
  row.appendChild(valueCell);
  row.appendChild(deleteCell);

  tableBody.appendChild(row);
};

// Adding values in the table...
document.addEventListener("DOMContentLoaded", function () {
  // const tableBody = document.querySelector("tbody");
  const tableBody1 = document.getElementById("tbody-1");
  const tableBody2 = document.getElementById("tbody-2");
  // Pass createTableRow as a callback to forEach with an anonymous function
  // Pass the history array as the third argument
  history.forEach((data) => createTableRow(data, tableBody1, history));
  // Pass the variables array as the third argument
  variables.forEach((data) => createTableRow(data, tableBody2, variables));
});

//handle the variables
// Function to handle a variable
const handleVariable = () => {
  const variableName = prompt("Enter the variable name:");
  if (
    !variableName ||
    variableName.toLowerCase() == "pi" ||
    variableName.toLowerCase() == "e"
  ) {
    alert("Invalid variable name!");
    return;
  }

  const variableValue = prompt(`Enter the value for "${variableName}":`);
  if (variableValue === null) {
    alert("Operation canceled.");
    return;
  }

  // Add the new variable to the variables array
  variables.push({ var: variableName, value: variableValue });

  // Get the table body element
  const tableBody = document.getElementById("tbody-2");

  // Create a new row for the new variable and add it to the table
  const newRowData = { var: variableName, value: variableValue };
  createTableRow(newRowData, tableBody, variables);
};

// Helper function to evaluate an expression
const evaluate = (expression) => {
  try {
    // Replace variable names with their values
    for (const variable of variables) {
      expression = expression.replace(
        new RegExp(`\\b${variable.var}\\b`, "g"),
        variable.value
      );
    }
    // Replace trigonometric functions with their JavaScript equivalents
    expression = expression.replace(/sin/g, "Math.sin");
    expression = expression.replace(/cos/g, "Math.cos");
    expression = expression.replace(/tan/g, "Math.tan");
    expression = expression.replace(/sqrt/g, "Math.sqrt");

    // Replace the ^ operator with **
    expression = expression.replace(/\^/g, "**");

    // Evaluate the expression using eval
    return eval(expression);
  } catch (error) {
    throw new Error("Invalid expression");
  }
};

// Helper function to update output display
const updateOutputDisplay = (result) => {
  try {
    const outputDisplay = document.getElementById("outputDisplay");
    outputDisplay.textContent = result.toFixed(4);
  } catch (err) {
    console.log(err);
    const outputDisplay = document.getElementById("outputDisplay");
    outputDisplay.textContent = "Invalid Expression";
  }
};

// Helper function to append a value to the expression input
const appendToExpression = (value) => {
  const expressionInput = document.getElementById("expressionInput");
  expressionInput.value += value;
};

// Helper function to clear the expression input
const clearExpression = () => {
  const expressionInput = document.getElementById("expressionInput");
  const outputDiv = document.getElementById("outputDisplay");
  outputDiv.innerHTML = "";
  expressionInput.value = "";
};

// Helper function to evaluate the expression and handle exceptions
const evaluateExpression = () => {
  const expressionInput = document.getElementById("expressionInput");
  const expression = expressionInput.value.trim(); //not working but eval takes the empty spaces....

  try {
    const result = evaluate(expression);
    updateOutputDisplay(result);
    history.push({ expression, result });

    //update the history...
    // Add the new variable to the variables array
    // history.push({ expression, value });

    // Get the table body element
    const tableBody = document.getElementById("tbody-1");

    // Create a new row for the new variable and add it to the table
    const newRowData = { expression, value: result };
    createTableRow(newRowData, tableBody, history);
  } catch (error) {
    console.log(error);
    updateOutputDisplay("Error: " + error.message);
  }
};

// Handle Enter key press
document
  .getElementById("expressionInput")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      evaluateExpression();
    }
  });
