// function pipe(...fns) {
//   return function piped(result) {
//     var list = [...fns];

//     while (list.length > 0) {
//       // take the first function from the list
//       // and execute it
//       result = list.shift()(result);
//     }

//     return result;
//   };
// }

function add(x) {
  return x + 1
}
function mul(x) {
  return x * 2
}

function pipe(...fns) {
  return function piped(result) {
    for (const fn of fns) {
      result = fn(result);
    }
    return result;
  };
}

function compose(...fns) {
  return pipe(...fns.reverse())
}

a = compose(add, mul)
let res = a(2)
console.log(res);

