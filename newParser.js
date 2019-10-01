const nullParser = input => {
  if (!input.startsWith("null")) return null;
  return [null, input.slice(4)];
};
const boolParser = input => {
  if (input.startsWith(true)) return [true, input.slice(4)];
  if (input.startsWith(false)) return [false, input.slice(5)];
  return null;
};
const commaParser = input => {
  if (input.startsWith(",")) return [, input.slice(1)];
  return null;
};
const numParser = input => {
  let regX = /(^-?[0-9]*\.?[0-9]+[Ee]?[-+]?[0-9]*)/;
  if (regX.test(input)) {
    let validNum = input.match(regX);
    if (
      !(input.startsWith(0) && input.includes(".")) ||
      !input.startsWith(".") ||
      (input.startsWith(0) && input.includes(".") && validNum[0].length > 0)
    ) {
      return [Number(validNum[0]), input.slice(validNum[0].length)];
    }
  }
  return null;
};
const stringParser = input => {
  let spChars = {
      "\\n": "\n",
      "\\r": "\r",
      "\\t": "\t",
      "\\f": "\f",
      "\\b": "\b",
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
        let spCh = input.slice(0, 2);
        if (spChars.hasOwnProperty(spCh)) {
          validStr.push(spChars[spCh]);
          input = input.slice(2);
        } else if (input[1] === "u") {
          input = input.slice(2);
          if (input.length <= 4) {
            return null;
          } else {
            let hexInput = input.slice(0, 4);
            if (hexInput.match(/[0-9]*[A-F]*[a-f]*/)) {
              validStr.push(String.fromCharCode(parseInt(hexInput, 16)));
            }
            input = input.slice(4);
          }
        }
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
      input = input.trim();
      if (input[0] === ",") input = input.slice(1);
      parsedInput = parseAll(input);
      if (parsedInput === null || parsedInput === undefined) return null;
      validArray.push(parsedInput[0]);
      input = parsedInput[1];
      input = input.trim();
    }
    return [validArray, input.slice(1)];
  }
  return null;
};

let fs = require("fs");
let inputFile = fs.readFileSync(
  "/home/veena/Documents/JSScripts/A_Projects/parser/inputFile.json",
  "UTF-8"
);
function parseAll(input) {
  let arrParsers = [
    commaParser,
    boolParser,
    numParser,
    stringParser,
    arrayParser,
   // objectParser,
    nullParser,
  ];
  for (let parse of arrParsers) {
    let result = parse(input);
    if (result !== null) return result;
  }
  return null;
}
console.log(parseAll(inputFile));
