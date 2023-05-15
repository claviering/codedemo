const crypto = require("crypto");

// Secret key
const key = "dfkcY1c3sfuw0Cii9DWjOUO3iQy2hqlDxyvDXd1oVMxwYAJSgeB6phO8eW1dfuwX";

// Data to hash
const data = ```GET
https://gdtv-api.gdtv.cn/api/tv/v2/tvChannel?category=0
1684120837921
```;

// Create HMAC object
const hmac = crypto.createHmac("sha256", key);

// Update with data
hmac.update(data);

// Finalize and get HMAC
const signature = hmac.digest("hex");
console.log(signature);
// Prints: c42ea058d1f24713325aa3eaae90b9da3c7f0b5eb6252c814485315d452b13b0
