function get(object, path, defaultValue) {
  path = path.replace(/\[(\d+)\]/g, ".$1").split('.')
  let result = object;
  for (const p of path) {
    console.log(p);
    result = Object(result)[p];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result
}

const o = {
  a: 1
}

console.log(get(o, 'a.b.c', 'default'));