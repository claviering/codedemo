const ecdsa = require('ecdsa')
const crypto = require('crypto')
const CoinKey = require('coinkey')
const sr = require('secure-random')
const X25519 = require('../js-x25519/x25519')

let privateKeyBuffer = sr.randomBuffer(32)
console.log('privateKeyBuffer', privateKeyBuffer);
let privateKey = parseInt(privateKeyBuffer.toString('hex'), 16)
let publicKeyBuffer = X25519.getPublic(privateKeyBuffer) // 公钥
let publicKey = parseInt(publicKeyBuffer.toString('hex'), 16)

const msg = new Buffer("hello world!", 'utf8')
const shaMsg = crypto.createHash('sha256').update(msg).digest()
const signature = ecdsa.sign(shaMsg, privateKey)
console.log('signature', signature);
const isValid = ecdsa.verify(shaMsg, signature, publicKey)
console.log(isValid) //true