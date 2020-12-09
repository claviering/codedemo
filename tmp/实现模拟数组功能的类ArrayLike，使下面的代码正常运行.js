// 实现模拟数组功能的类ArrayLike，使下面的代码正常运行。
// var arr = new ArrayLike();
// console.log(arr.length); // 0
// arr.push(1);
// console.log(arr[0]); // 1
// console.log(arr.length); // 1

function ArrayLike() {}
ArrayLike.prototype = Array.prototype
var arr = new ArrayLike();
console.log(arr.length); // 0
arr.push(1);
console.log(arr[0]); // 1
console.log(arr.length); // 1