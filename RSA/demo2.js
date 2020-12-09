const fs = require("fs");
const NodeRSA = require('node-rsa');

const private_key = fs.readFileSync('./RSA/private.pem');
const key = new NodeRSA(private_key);

let data = 'hello'

const encrypt_rsa = function (data) {
  const result = key.encryptPrivate(data);
  console.log('buffer', result);
  let base64Result = result.toString('base64');
  console.log('base64', base64Result);
  const hexResult = Buffer.from(base64Result, 'utf8').toString('hex');
  console.log('hex', hexResult);
  return hexResult;
}
let params = {
  domainId: "trendygroup",
  externalUserId: "allen.chen",
}
encrypt_rsa(JSON.stringify(params))