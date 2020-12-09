const fs = require('fs')
const crypto = require('crypto')
const pem = require('pem');
const hashes = crypto.getHashes();
console.log(hashes); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]

let privateKeyBuffer = fs.readFileSync('./tls/server.key', 'utf8')
let publicKeyBuffer = fs.readFileSync('./tls/server.public.key', 'utf8')

const sign = crypto.createSign('SHA384');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKeyBuffer, 'hex');
console.log('signature', signature)

const verify = crypto.createVerify('SHA384');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKeyBuffer, signature));