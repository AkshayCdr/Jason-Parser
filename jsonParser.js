const nullParser = (input) => {
  if (!input.startsWith("null")) return null;
  return [null, input.slice(4)];
};

const boolParser = (input) => {
  if (input.startsWith("true")) return [true, input.slice(4)];
  if (input.startsWith("false")) return [false, slice(5)];
  return null;
};

const numberParser = (input) => {
  // let regex = /[+-]*\d+\.?\d*[E|e]*[+-]*\d+/;
  // let regex = /[-+]?(-?\[0-9]+(\.\[0-9]*)?|\.-?\[0-9]+)([E|e][+-]?\[0-9]+)?/i;
  let regex = /^[-+]?(\d+(\.\d*)?|\.\d+)([E|e][+-]?\d+)?/i;
  let result = input.match(regex);
  if (result) return [result[0], input.slice(result[0].length)];
  return null;
};

const whiteSpaceParser = (input) => {
  // let regx = /\s*/;
  // let regx = /[\s\n\t\r]+/;
  let regx = /^[\s\n]/;
  let result = input.match(regx);
  if (result) return [null, input.slice(result[0].length)];
  return null;
  // console.log(result);
  // console.log(result[0].length);
  // console.log(input.slice(result[0].length));
};

const stringParser = (input) => {
  if (!input.startsWith('"')) return null;
  let i = 1;
  while (input[i] !== '"') {
    if (input[i] === "\\") {
      i += 2;
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

const valueParser = (input) => {
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
};

const arrayParser = (input) => {
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
    arr.push(value[0]);
    if (whiteSpaceParser(value[1])) {
      space = whiteSpaceParser(value[1]);
      input = space[1];
    }
    let withoutcomma = commaParser(value[1]);
    if (!withoutcomma) {
      return null;
    }
    input = withoutcomma[1];
  }
  if (input === "]") {
    return [arr, input.slice(1)];
  } else {
    return null;
  }
};
