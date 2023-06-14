const string = "something fs: calc{{200px}}, mt: calc{{200px}} something";
const newString = string.replace(/(fs|mt):/g, (match) => {
  return match === "fs:" ? "font-size:" : "margin-top:";
});
console.log(newString); // Output: "something font-size: calc{{200px}}, margin-top: calc{{200px}} something"
