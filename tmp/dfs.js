function dfs(root) {
  if (!root) return;
  let queue = [root];
  while (queue.length) {
    let node = queue.shift();
    console.log(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}

dfs({
  value:0,
  left:{
    value:1,
    left:{
      value:11
    }
  },
  right:{
    value:2,
    left:{
      value:12
    }
  }
})