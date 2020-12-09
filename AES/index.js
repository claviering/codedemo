const Aes = require('aes-256-gcm');
 
// Must be 32 Bytes.
const SHARED_SECRET = '12345678901234567890123456789012';
 
// Encrypt:
let { ciphertext, iv, tag } = Aes.encrypt('hi', SHARED_SECRET);

console.log('ciphertext', ciphertext)
console.log('iv', iv)
console.log('SHARED_SECRET', SHARED_SECRET.length)
console.log('tag', tag)
 
//   ciphertext: 'VOE='
//   iv: '0K6oPWsBAHLXYtLu5VAvsQ=='
//   tag: 'hCae3Lt5sAK3oNAnUh5emA==' 
 
 
// Decrypt:
let cleartext = Aes.decrypt(ciphertext, iv, tag, SHARED_SECRET);

console.log('cleartext', cleartext)
 
// `cleartext` contains:
// 'hi'