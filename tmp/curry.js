// 主要思路是什么呢，要判断当前传入函数的参数个数 (args.length) 是否大于等于原函数所需参数个数 (fn.length) ，如果是，则执行当前函数；如果是小于，则返回一个函数。
const curry = (fn, ...args) => 
    // 函数的参数个数可以直接通过函数的.length属性来访问
    args.length >= fn.length // 这个判断很关键！！！
    // 传入的参数大于等于原始函数fn的参数个数，则直接执行该函数
    ? fn(...args)
    /**
     * 传入的参数小于原始函数fn的参数个数时
     * 则继续对当前函数进行柯里化，返回一个接受所有参数（当前参数和剩余参数） 的函数
    */
    : (..._args) => curry(fn, ...args, ..._args);

function add1(x, y, z) {
    return x + y + z;
}
const add = curry(add1);
console.log(add(1, 2, 3));
console.log(add(1)(2)(3));
console.log(add(1, 2)(3));
console.log(add(1)(2, 3));