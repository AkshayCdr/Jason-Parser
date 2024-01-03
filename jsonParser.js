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
  let regex = /[+-]*\d+\.?\d*[E|e]*[+-]*\d+/;
  let result = input.match(regex);
  if (result) return [result[0], input.slice(result[0].length)];
  return null;
};

const whiteSpaceParser = (input) => {
  // let regx = /\s*/;
  let regx = /[\s\n\t\r]+/;
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
      i = +2;
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
