let axios = require("axios");
const WebSocket = require("websocket").w3cwebsocket;
var CryptoJS = require("crypto-js");

let COMMON_HEADERS = {
  method: "GET",
  scheme: "https",
  accept: "application/json, text/plain, */*",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
  "content-type": "application/json",
  origin: "https://www.gdtv.cn",
  referer: "https://www.gdtv.cn/",
  "sec-ch-ua":
    '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  "x-itouchtv-ca-key": "89541443007807288657755311869534",
  "x-itouchtv-client": "WEB_PC",
  "x-itouchtv-device-id": "WEB_a719ae70-076a-11ee-97d8-61607327fc49",
};

const options = {
  headers: {
    Origin: "https://www.gdtv.cn",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  },
};

const connection = new WebSocket(
  "wss://tcdn-ws.itouchtv.cn:3800/connect",
  null,
  options
);

// handle connection open event
connection.onopen = () => {
  console.log("WebSocket connection established");
  sendNode();
};

// handle incoming messages
connection.onmessage = (message) => {
  console.log("Received message:", message.data);
  let data = JSON.parse(message.data);
  if (data["status"] == 201) {
    getParams();
    get_play_url(data["wsnode"]);
    // get_play_url(
    //   "83a66f3491953cce83aa023eba0d9689-5iyojk3b5I46pBgkA4NTcIz45tx6YPC4SklQz%2BiJ0zzZrszsNYSDHa18XbRHYNyT7ODL%2B4N%2FuRLVZvp1igVHR0wM8uGNSLBBNgPIVEhLIKo1kPxVN3bq3MsNxXQSEpy0lOl3pFDH4lwMTCi45RkoJkz1rFNTdmqxCj0fLrngXJA%3D"
    // );
  }
};

// handle connection errors
connection.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// handle connection close event
connection.onclose = () => {
  console.log("WebSocket connection closed");
};

async function getParams() {
  let url = "https://tcdn-api.itouchtv.cn/getParam";
  let t = 1687768606447;
  let sign = signature(url, t);
  let headers = {
    ...COMMON_HEADERS,
    authority: "tcdn-api.itouchtv.cn",
    path: "/getParam",
    Method: "GET",
    scheme: "https",
    "x-itouchtv-ca-signature": sign,
    "x-itouchtv-ca-timestamp": t,
  };
  let response = await axios.get(url, {
    headers: headers,
  });
  console.log("node:", response.data.node);
  return response.data.node;
}

async function sendNode() {
  console.log("sendNode");
  let message = await getParams();
  let m = {
    route: "getwsparam",
    message: message,
  };
  connection.send(JSON.stringify(m));
}

async function get_play_url(wsnode) {
  let node_b64_str = Buffer.from(wsnode).toString("base64");
  let play_url =
    "https://gdtv-api.gdtv.cn/api/tv/v2/tvChannel/53?tvChannelPk=53&node=" +
    node_b64_str;
  let t = Date.now();
  let sign = signature(play_url, t);

  let headers = {
    ...COMMON_HEADERS,
    authority: "gdtv-api.gdtv.cn",
    path: "/api/tv/v2/tvChannel/53?tvChannelPk=53&node=" + node_b64_str,
    Method: "GET",
    scheme: "https",
    "x-itouchtv-ca-signature": sign,
    "x-itouchtv-ca-timestamp": t,
  };
  let response = await axios.get(play_url, { headers: headers });
  console.log(response.data);
  let playUrl = JSON.parse(response.data.playUrl);
  gethd(playUrl.hd);
  return playUrl.hd;
}

function signature(url, t) {
  // Secret key
  const key =
    "dfkcY1c3sfuw0Cii9DWjOUO3iQy2hqlDxyvDXd1oVMxwYAJSgeB6phO8eW1dfuwX";
  let msg = ["GET\n", url, "\n", t, "\n"].join("");
  let str = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(msg, key));
  return str;
}

async function gethd(url) {
  let headers = {
    authority: "tcdn.itouchtv.cn",
    path: url.replace("https://tcdn.itouchtv.cn", ""),
    method: "GET",
    scheme: "https",
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "content-type": "application/json",
    origin: "https://www.gdtv.cn",
    referer: "https://www.gdtv.cn/",
    "sec-ch-ua":
      '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  };
  try {
    let res = await axios.get(url, { headers });
    console.log(res.data);
  } catch (error) {
    console.log(error && error.message);
  }
}

setInterval(sendNode, 20 * 1000);
