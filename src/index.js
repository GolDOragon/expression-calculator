function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  function get_array(raw_str) {
    let raw_array = [];
    let substring = "";

    for (let symbol of raw_str) {
      if (symbol == " " && substring != "") {
        raw_array.push(substring);
        substring = "";
      } else if (symbol != " ") {
        if (
          symbol == "(" ||
          symbol == ")" ||
          symbol == "+" ||
          symbol == "-" ||
          symbol == "*" ||
          symbol == "/"
        ) {
          raw_array.push(substring);
          substring = "";
          raw_array.push(symbol);
        } else {
          substring += symbol;
        }
      }
    }
    raw_array.push(substring); // last element

    let result = [];
    for (let i = 0; i < raw_array.length; i++) {  // delete empty elements 
      if (raw_array[i] == "") continue;
      result.push(raw_array[i]);
    }
    return result;
  }

  function check_validation(arr) {
    // divided on zero
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] == "0" && arr[i - 1] == "/") {
        return "TypeError: Division by zero.";
      }
    }
    // extra nested brackets
    let open_brackets = 0;
    let close_brackets = 0;
    
    for (let element of arr) {
      if (element == "(") open_brackets++;
      else if (element == ")") close_brackets++;

      if (open_brackets < close_brackets) {   
        return "ExpressionError: Brackets must be paired";
      }
    }
    if (open_brackets != close_brackets) {
      return "ExpressionError: Brackets must be paired";
    }

    return false;
  }

  function get_inside_of_brackets(arr) {
    let open_brackets = 0;
    let close_brackets = 0;

    let first_open_bracket;
    let last_close_bracket;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == "(") {
        if (first_open_bracket != undefined) {
          open_brackets++;
        } else {
          first_open_bracket = i;
          open_brackets++;
        }
      } else if (arr[i] == ")") {
        close_brackets++;
        if (open_brackets == close_brackets) {
          last_close_bracket = i;
          return [first_open_bracket + 1, last_close_bracket];
        }
      }
    }
  }

  function get_position_of_operator(arr) {
    // first of all "*" or "/"
    let order;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == "*" || arr[i] == "/") {
        order = i;
        return order;
      }
    }
    // if "*" or "/" aren't found => search "+" or "-"
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == "+" || arr[i] == "-") {
        order = i;
        return order;
      }
    }
  }

  function calculate(a, operator, b) {
    if (operator == "+") return a + b;
    else if (operator == "-") return a - b;
    else if (operator == "*") return a * b;
    else if (operator == "/") return a / b;
  }

  function get_result(arr) {
    let copy_arr = arr.slice();

    while (copy_arr.includes("(")) {
      // first of all solve inside brackets
      let positions = get_inside_of_brackets(copy_arr);
      let inside_exercise = copy_arr.slice(positions[0], positions[1]);
      let local_result = get_result(inside_exercise);
      
      copy_arr.splice(
        positions[0] - 1,
        inside_exercise.length + 2,
        local_result
      );
    }

    while (copy_arr.length > 1) {
      // if brackets aren't found => solve in accordance with the rules of algebra
      let order = get_position_of_operator(copy_arr);

      let num1 = Number(copy_arr[order - 1]);
      let operator = copy_arr[order];
      let num2 = Number(copy_arr[order + 1]);
      
      let answer = calculate(num1, operator, num2);
      copy_arr.splice(order - 1, 3, answer);
    }

    return copy_arr[0];
  }

  let exercise = get_array(expr);
  let message = check_validation(exercise);
  if (message) throw Error(message);

  let answer = get_result(exercise);
  return answer;
}

module.exports = {
  expressionCalculator
};