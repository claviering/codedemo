let arr = [2, 19, 14, 5, 16]
let iterator = arr[Symbol.iterator]();
function max(iterator, pre) {
  iter = iterator.next();
  if (iter.done) return Math.max(pre, 0);
  let cur = iter.value;
  let next = max(iterator, cur);
  console.log("最大值和当前元素差值:", Math.max(cur, pre, next) - cur);
  return Math.max(cur, pre, next);
}
let num = max(iterator, 0);
console.log("最大值", num);