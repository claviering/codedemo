function rand_number(n) {
  let p = String(Math.round(Math.random() * 10 ** n)).padStart(n, 0);
  return p;
}
console.log(rand_number(3));
