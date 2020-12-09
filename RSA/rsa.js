const fs = require("fs");
const crypto = require("crypto");
// const public_key = fs.readFileSync('./RSA/public.pem');
const private_key = fs.readFileSync('./RSA/private.pem');

module.exports = {
  // 私钥加密
  privateEncrypt: function (params) {
    if (!params) return params;
    params = JSON.stringify(params);
    let buffer = Buffer.from(params)
    let crypted_buffer = crypto.privateEncrypt(private_key, buffer)
    let base64Result = crypted_buffer.toString('base64');
    let hexResult = Buffer.from(base64Result, 'utf8').toString('hex');
    // 由于RSA加密后的字符串可能含有“＝”等特殊字符，需要将加密后的字符串转换为hex格式
    return hexResult;
  },
  // 公钥解密
  // publicDecrypt: function (crypted_buffer) {
  //   let decrypted_auth = crypto.publicDecrypt(public_key, crypted_buffer)
  //   let result = decrypted_auth.toString();
  //   console.log('公钥解密数据 hex:', result);
  //   return result;
  // },
}