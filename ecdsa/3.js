const fs = require('fs')
// const path = require('path')
const crypto = require('crypto')
// const hashes = crypto.getHashes();
// console.log(hashes); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]

const algorithm = 'sha384';

function signer(data) {
  let key = fs.readFileSync('../tls/server.key', 'utf-8');
  let sign = crypto.createSign(algorithm);
  sign.update(data);
  let sig = sign.sign(key, 'base64');
  return sig;
}
function verify(sig,data){
  let publicPem = fs.readFileSync('../tls/root.public.key');
  let pubkey = publicPem.toString();
  let verify = crypto.createVerify(algorithm);
  verify.update(data);
  return verify.verify(pubkey, sig, 'base64')
}
let data = "hello world";   //传输的数据
let sign = signer(data);
console.log('sign', sign);
console.log(verify(sign, data),data); // true
