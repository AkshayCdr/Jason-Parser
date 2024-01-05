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
  let regex = /^[-+]?(\d+(\.\d*)?|\.\d+)([E|e][+-]?\d+)?/i;
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

const stringParser = (input) => {
  if (!input.startsWith('"')) return null;
  let i = 1;
  let arr = ["b", "f", "n", "r", "t", "\\", "/", '"'];
  let arr2 = ["u"];
  while (input[i] !== '"') {
    if (input[i] === "\\") {
      if (arr.includes(input[i + 1])) {
        i += 2;
      } else if (arr2.includes(input[i + 1])) {
        i += 4;
      } else {
        return null;
      }
    }
    i++;
  }
  return [input.substring(1, i), input.slice(i + 1)];
};

const colonParser = (input) => {
  if (!input.startsWith(":")) return null;
  return [input[0], input.slice(1)];
};

const commaParser = (input) => {
  if (!input.startsWith(",")) return null;
  return [input[0], input.slice(1)];
};

function valueParser(input) {
  let parsers = [
    stringParser,
    numberParser,
    // objectParser,
    arrayParser,
    boolParser,
    nullParser,
  ];
  for (let i of parsers) {
    let result = i(input);
    if (result) {
      return result;
    }
  }
  return null;
}

function arrayParser(input) {
  if (!input.startsWith("[")) return null;
  let i = 1;
  let arr = [];
  input = input.slice(1);
  while (true) {
    if (input === "]") {
      break;
    }
    let space;
    if (whiteSpaceParser(input)) {
      space = whiteSpaceParser(input);
      input = space[1];
    }
    let value = valueParser(input);
    if (!value) {
      return null;
    }
    input = value[1];
    arr.push(value[0]);
    if (whiteSpaceParser(value[1])) {
      space = whiteSpaceParser(value[1]);
      input = space[1];
    }
    let withoutcomma = commaParser(value[1]);
    if (!withoutcomma) {
      break;
    }

    if (whiteSpaceParser(value[1])) {
      space = whiteSpaceParser(value[1]);
      input = space[1];
    }
    //after comma no value then return null
    if (withoutcomma[1] === "]") {
      return null;
    }
    input = withoutcomma[1];
  }
  console.log(input.charAt(1));
  if (input.startsWith("]")) {
    if (input.charAt(1) === "," || input.charAt(1) === "]") {
      return null;
    }
    return [arr, input.slice(1)];
  }
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
