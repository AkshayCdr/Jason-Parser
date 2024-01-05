const fs = require("node:fs");

const nullParser = (input) => {
  if (!input.startsWith("null")) return null;
  return [null, input.slice(4)];
};

// const boolParser = (input) => {
//   if (input.startsWith("true")) return [true, input.slice(4)];
//   if (input.startsWith("false")) return [false, slice(5)];
//   return null;
// };

function boolParser(input) {
  if (input.startsWith("true")) {
    return [true, input.slice(4)];
  } else if (input.startsWith("false")) {
    return [false, input.slice(5)];
  }
  return null;
}

const numberParser = (input) => {
  // let regex = /^[-+]?(\d+(\.\d*)?|\.\d+)([E|e][+-]?\d+)?/i;
  let regex = /^[-+]?([1-9]\d*|0)(\.\d*)?([Ee][+-]?\d+)?/;
  let result = input.match(regex);
  if (result) return [result[0], input.slice(result[0].length)];
  return null;
};

const whiteSpaceParser = (input) => {
  let regx = /^[\s\n\r\t]/;
  let result = input.match(regx);
  if (result) return [null, input.slice(result[0].length)];
  return null;
};

function stringParser(input) {
  if (!input.startsWith('"')) return null;
  let unicodeRegex = /[\u0000-\uFFFF]/g;
  let arr = ["b", "f", "n", "r", "t", "\\", "/", '"', "u"];
  // let arr = ["b", "f", "r", "\\", "/", '"', "u"];
  let i = 1;
  while (input[i] !== '"') {
    if (input[i] === "\n" || input[i] === "\t") {
      return null;
    }
    if (input[i] === "\\") {
      if (!arr.includes(input[i + 1])) {
        return null;
      }
      if (input[i + 1] === "u") {
        if (!input.slice(i + 2).match(unicodeRegex)) {
          return null;
        }
        i += 5;
      } else {
        i += 2;
      }
    } else {
      i++;
    }
  }
  return [input.substring(1, i), input.slice(i + 1)];
}
const colonParser = (input) => {
  if (!input.startsWith(":")) return null;
  return [input[0], input.slice(1)];
};

const commaParser = (input) => {
  if (!input.startsWith(",")) return null;
  return [input[0], input.slice(1)];
};

function valueParser(input) {
  const Jsonparsers = [
    stringParser,
    numberParser,
    objectParser,
    arrayParser,
    boolParser,
    nullParser,
  ];

  for (let Json of Jsonparsers) {
    const result = Json(input);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

function arrayParser(input) {
  if (!input.startsWith("[")) return null;
  input = input.slice(1);
  let arr = [];
  while (true) {
    let space = whiteSpaceParser(input);
    if (space) input = space[1];

    if (input.startsWith("]")) {
      break;
    }

    let value = valueParser(input);
    if (!value) return null;
    arr.push(value[0]);

    space = whiteSpaceParser(value[1]);
    if (space) input = space[1];
    else input = value[1];

    let comma = commaParser(input);
    if (!comma) break;

    space = whiteSpaceParser(comma[1]);
    if (space) input = space[1];
    else input = comma[1];

    if (input.startsWith("]")) {
      return null;
    }
  }
  if (input.startsWith("]")) return [arr, input.slice(1)];
  return null;
}

function objectParser(input) {
  if (!input.startsWith("{")) return null;
  let obj = {};
  input = input.slice(1);
  while (true) {
    let space = whiteSpaceParser(input);
    if (space) input = space[1];

    let result = stringParser(input);
    if (!result) return null;
    let [key, value] = result;

    space = whiteSpaceParser(value);
    if (space) value = space[1];

    let colon = colonParser(value);
    if (!colon) return null;

    space = whiteSpaceParser(colon[1]);
    if (space) {
      value = space[1];
    } else {
      value = colon[1];
    }

    value = valueParser(value);
    if (!value) return null;

    obj[key] = value[0];

    space = whiteSpaceParser(value[1]);
    if (space) input = space[1];
    else input = value[1];

    let comma = commaParser(input);
    if (!comma) break;

    space = whiteSpaceParser(comma[1]);
    if (space) input = space[1];
    else input = comma[1];
  }
  if (input.startsWith("}")) return [obj, input.slice(1)];
  return null;
}

function main() {
  let i = 1;
  while (true) {
    try {
      let input = fs.readFileSync(`pass${i}.json`).toString().trim("");
      let array = arrayParser(input);
      let object = objectParser(input);
      if (array || object) {
        let output = valueParser(input);
        // console.log(output);
        if (output) {
          console.log("working");
        } else {
          console.log("failed");
        }
      } else {
        console.log("failed");
      }
      i++;
      if (i === 7) {
        break;
      }
    } catch (error) {
      console.log(error);
    }
  }
  let j = 1;
  while (true) {
    try {
      let input = fs.readFileSync(`fail${j}.json`).toString().trim("");
      let array = arrayParser(input);
      let object = objectParser(input);

      if (array || object) {
        let output = valueParser(input);
        if (!output) {
          console.log("failed");
        } else {
          console.log(`${output} is fail${j}`);
        }
      } else {
        console.log("failed");
      }

      j++;
      if (j === 34) {
        break;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

main();
