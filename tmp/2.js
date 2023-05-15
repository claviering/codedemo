var CryptoJS = require("crypto-js");

// Secret key
const key = "dfkcY1c3sfuw0Cii9DWjOUO3iQy2hqlDxyvDXd1oVMxwYAJSgeB6phO8eW1dfuwX";

// Data to hash
const data =
  "GET\nhttps://gdtv-api.gdtv.cn/api/tv/v2/tvMenu?tvChannelPk=53&beginAt=2023-05-09&endAt=2023-05-18\n1684140171729\n";

console.log(data);

var base64 = "";
base64 = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(data, key));
console.log(base64);
