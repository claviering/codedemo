/*
 * @Author: lin weiye 
 * @Date: 2019-11-25 01:38:33 
 * @Last Modified by: weiye
 * @Last Modified time: 2019-11-26 17:31:28
 */
const crypto = require('crypto');
const algorithm = 'aes-128-ecb';
const key = 'abcd1234abcd1234'; // 16 B 128 bits
const dataString = "{'storeId':6,'userLoginPhone':'15625076252'}";
const dataObject = {
  storeId: 6,
  userLoginPhone: "15625076252"
}

var res = '2089bceafc291d91499a7bfa7d982ba8c142e353e1b6022e606f37b7ee10332cec6c31f899609ec46c03b1c58ce6ca80'

/**
 * 使用 AES-128-ECB 模式加密
 * @param {String} data 要加密的数据
 * @return {String} 加密后的数据
 */
function encrypt(data) {
  console.log('data', data);
  const cipher = crypto.createCipheriv(algorithm, key, '');
  var encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

console.log(encrypt(dataString));
console.log(encrypt(JSON.stringify(dataObject)));

/**
 * 使用 AES-128-ECB 模式解密
 * @param {String} data 要加密的数据
 * @return {String} 加密后的数据
 */
function decrypt(data) {
  const decipher = crypto.createDecipheriv(algorithm, key, '');
  var decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

console.log(decrypt(res));

/**
 * @param {String} data 要加密的数据
 * @return {String} 加密后的数据
 */
function encryptRSA(data) {
  const cipher = crypto.publicEncrypt({
    key: '',
    buffer: ''
  });
  var encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * @param {String} data 要加密的数据
 * @return {String} 加密后的数据
 */
function decryptRSA(data) {
  const decipher = crypto.createDecipheriv(algorithm, key, '');
  var decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}