const nullParser = input => {
  if (!input.startsWith("null")) return null;
  return [null, input.slice(4)];
};

const boolParser = input => {
  if (input.startsWith(true)) return [true, input.slice(4)];
  if (input.startsWith(false)) return [false, input.slice(5)];
  return null;
};

const wsParser = (input, bIndex) => {
  input = input.slice(bIndex);
  return input.trim();
};

const numParser = input => {
    let regX = /^-?[0-9]*\.?[0-9]+([Ee]?[+-]?[0-9]+)?/;
  if (regX.test(input)) {
    let validNum = input.match(regX);
    if (
      !validNum[0].startsWith(0) ||
      (validNum[0].startsWith(0) &&
        (validNum[0].includes(".") || validNum[0].length == 1))
    )
      return [Number(validNum[0]), input.slice(validNum[0].length)];
  }
  return null;
};

const parseEscapeInput = (input, ch, validStr) => {
  let spChars = {
      n: "\n",
      r: "\r",
      t: "\t",
      f: "\f",
      b: "\b",
      "\\": "\\",
      "/": "/",
      '"': '"',
    },
    result;
  if (spChars.hasOwnProperty(ch)) {
    result = spChars[ch];
    input = wsParser(input, 2);
  } else if (ch === "u") {
    let hexInput = input.slice(2);
    input = wsParser(input, 2);
    if (hexInput.length <= 4) return null;
    hexInput = input.slice(0, 4);
    if (hexInput.match(/[0-9]*[A-F]*[a-f]*/)) {
      result = String.fromCharCode(parseInt(hexInput, 16));
    }
    input = wsParser(input, 4);
  } else {
    return null;
  }
  return [result, input];
};

const stringParser = input => {
  let validStr = [],
    result;
  if (input.startsWith('"')) {
    input = wsParser(input, 1);
    while (input[0] !== '"') {
      if (input.indexOf('"') === -1) return null;
      if (input[0] === "\\") {
        result = parseEscapeInput(input, input[1], validStr);
        if (result === null) return null;
        validStr.push(result[0]);
        input = result[1];
      } else {
        validStr.push(input[0]);
        input = wsParser(input, 1);
      }
    }
    return [validStr.join(""), input.slice(1)];
  }
  return null;
};

const stringParser_working = input => {
  let spChars = {
      n: "\n",
      r: "\r",
      t: "\t",
      f: "\f",
      b: "\b",
      "\\": "\\",
      "/": "/",
      '"': '"',
    },
    validStr = [];
  if (input.startsWith('"')) {
    input = input.slice(1);
    while (input[0] !== '"') {
      if (input.indexOf('"') === -1) return null;
      if (input[0] === "\\") {
        let ch = input[1];
        if (spChars.hasOwnProperty(ch)) {
          validStr.push(spChars[ch]);
          input = input.slice(2);
          input = input.trim();
        } else if (ch === "u") {
          let hexInput = input.slice(2);
          input = input.slice(2);
          if (hexInput.length <= 4) {
            return null;
          } else {
            hexInput = input.slice(0, 4);
            if (hexInput.match(/[0-9]*[A-F]*[a-f]*/)) {
              validStr.push(String.fromCharCode(parseInt(hexInput, 16)));
            }
            input = input.slice(4);
            input = input.trim();
          }
        } else return null;
      } else {
        validStr.push(input[0]);
        input = input.slice(1);
      }
    }
    return [validStr.join(""), input.slice(1)];
  }
  return null;
};

const arrayParser = input => {
  let validArray = [],
    parsedInput;
  input = input.trim();
  if (input.startsWith("[")) {
    input = wsParser(input, 1);
    while (input[0] !== "]"  ) {
      if (input.indexOf("]") === -1) return null; // check the size
      parsedInput = valueParser(input);
      if (parsedInput === null || parseInput[0] === NaN) return null;
      validArray.push(parsedInput[0]);
      input = parsedInput[1].trim();
      if (input[0] === ",") {
        input = wsParser(input, 1);
        if (input[0].startsWith("]")) return null;
      }
    }
    return [validArray, input.slice(1)];
  }
  return null;
};

const objectParser = input => {
  let validObject = {},
    parsedObj,
    key,
    val;
  input = input.trim();
  if (input[0].startsWith("{")) {
    input = wsParser(input, 1);
    while (input[0] !== "}") {
      if (input.indexOf("}") === -1) return null;
      if (input.indexOf(":") === -1) return null;
      //key
      parsedObj = stringParser(input);
      if (parsedObj === null) return null;
      key = parsedObj[0];
      input = parsedObj[1];
      input = input.trim();
      //:
      if (input[0] !== ":") return null;
      input = wsParser(input, 1);
      //value
      parsedObj = valueParser(input);
      if (parsedObj === null) return null;
      val = parsedObj[0];
      validObject[key] = val;
      //,next ele
      input = parsedObj[1];
      input = input.trim();
      if (input[0] === ",") {
        input = wsParser(input, 1);
        if (input[0].startsWith("}")) return null;
      }
    }
    return [validObject, input.slice(1)];
  }
  return null;
};

const valueParser = input => {
  let arrParsers = [
    boolParser,
    numParser,
    stringParser,
    arrayParser,
    objectParser,
    nullParser,
  ];
  for (let parse of arrParsers) {
    let result = parse(input);
    if (result !== null) return result;
  }
  return null;
};

let fs = require("fs");
let fName = "/home/veena/Documents/pushToGit/Project_JSONParser/inputFile.json";
let inputFile = fs.readFileSync(fName, "UTF-8");

function parseInput(input) {
  let result = arrayParser(input) || objectParser(input);
  if (result !== null) return result;
  return null;
}
console.log(parseInput(inputFile));
//console.log(valueParser(inputFile));
