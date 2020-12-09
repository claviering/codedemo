let {privateEncrypt} = require('./rsa');
let axios = require('axios');
const baseUrl = 'https://bi.trendy-global.com';
const providerName = 'trendygroup';

async function run(ssoToken) {
  let query = `?provider=${providerName}&ssoToken=${ssoToken}`;
  let url = baseUrl + query;
  console.log('请求 url: ', url);
  let res = await axios.get(url);
  return res.data;
}

async function genToken() {
  let params = {
    domainId: "trendygroup",
    externalUserId: "7ujm*IK<",
  }
  let token = privateEncrypt(params);
  console.log(token);
  let res = await run(token);
  console.log('返回结果', res);
}

genToken()