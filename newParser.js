const nullParser = input => {
  if (!input.startsWith("null")) return null;
  return [null, input.slice(4)];
};
const boolParser = input => {
  if (input.startsWith(true)) return [true, input.slice(4)];
  if (input.startsWith(false)) return [false, input.slice(5)];
  return null;
};
const numParser = input => {
  let regX = /(^-?[0-9]*\.?[0-9]+[Ee]?[-+]?[0-9]*)/;
  if (regX.test(input)) {
    let validNum = input.match(regX);
    if (
      !validNum[0].startsWith(0) ||
      (validNum[0].startsWith(0) &&
        (validNum[0].includes(".") || validNum[0].length == 1))
    ) {
      return [Number(validNum[0]), input.slice(validNum[0].length)];
    }
  }
  return null;
};
const stringParser = input => {
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
        let spCh = input[1];
        if (spChars.hasOwnProperty(spCh)) {
          validStr.push(spChars[spCh]);
          input = input.slice(2);
          input = input.trim();
        } else if (input[1] === "u") {
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
    input = input.slice(1);
    input = input.trim();
    while (input[0] !== "]") {
      if (input.indexOf("]") === -1) return null;
      parsedInput = valueParser(input);
      if (parsedInput === null) return null;
      validArray.push(parsedInput[0]);
      input = parsedInput[1].trim();
      if (input[0] === ",") {
        input = input.slice(1);
        input = input.trim();
        if (input[0].startsWith("]")) return null;
      }
    }
    return [validArray, input.slice(1)];
  }
  return null;
};
const objectParser = function(input) {
  let validObject = {},
    parsedObj,
    key,
    val;
  input = input.trim();
  if (input[0].startsWith("{")) {
    input = input.slice(1);
    input = input.trim();
    while (input[0] !== "}") {
      if (input.indexOf("}") === -1) return null;
      if (input.indexOf(":") === -1) return null;
      //key
      parsedObj = stringParser(input);
      if (parsedObj === null) return null;
      key = parsedObj[0];
      input = parsedObj[1];
      input = input.trim();
      //check for :
      if (input[0] !== ":") return null;
      input = input.slice(1);
      input = input.trim();
      //value
      parsedObj = valueParser(input);
      if (parsedObj === null) return null;
      val = parsedObj[0];
      validObject[key] = val;
      //check for next ele
      input = parsedObj[1];
      input = input.trim();
      if (input[0] === ",") {
        input = input.slice(1);
        input = input.trim();
        if (input[0].startsWith("}")) return null;
      }
    }
    return [validObject, input.slice(1)];
  }
  return null;
};
const valueParser = function(input) {
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
let inputFile = fs.readFileSync(fName,"UTF-8");

function parseAll(input) {
  let result = arrayParser(input) || objectParser(input);
  if (result !== null) return result;
  return null;
}
console.log(parseAll(inputFile));
