let axios = require("axios");

const instance = axios.create({
  baseURL: "https://www.quntitong.cn",
  timeout: 2000,
  headers: {
    Host: "www.quntitong.cn",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    Accept: "_/_",
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac",
    Referer: "https://servicewechat.com/wxe350a6af6d22b9e8/106/page-frame.html",
    "Accept-Language": "en-us",
  },
});

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 查询场地日期信息
async function getTime(opendate) {
  const params = {
    citys: "440100",
    cgCode: "0020C061256",
    booking: "Y",
    sportCode: "003",
  };
  let url = "/sportinterNew/androidstadium/queryStore2.do";
  try {
    console.log("查询场地日期信息中....");
    let res = await instance.post(url, new URLSearchParams(params));
    if (!res || !res.data || !res.data.length) {
      console.log("查询场地日期信息");
      console.log(res && res.data);
    }
    for (let i = 0; i < res.data.length; i++) {
      const item = res.data[i];
      console.log(`日期 ${item.opendate} 可预约 ${item.ordernum}`);
      if (item.opendate === opendate && Number(item.ordernum) > 0) {
        return (fieldName, startTime) =>
          getDetail(opendate, fieldName, startTime);
      }
    }
    console.log(`${opendate}日期没有可以预约的场地`);
  } catch (error) {
    console.log("查询场地日期信息 error", error);
  }
}

// 查询场次具体信息
async function getDetail(opendate, fieldName, startTime) {
  const params = {
    cgCode: "0020C061256",
    sportCode: "003",
    openDate: opendate,
    booking: "Y",
  };
  let url = "/sportinterNew/androidstadium/queryStoreByType.do";
  try {
    console.log("查询场次具体信息....");
    let res = await instance.post(url, new URLSearchParams(params));
    if (!res || !res.data || !res.data.length) {
      console.log("查询场次具体信息数据为空");
      console.log(res && res.data);
      return;
    }
    for (let i = 0; i < res.data.length; i++) {
      const item = res.data[i];
      for (let j = 0; j < item.storeList.length; j++) {
        const store = item.storeList[j];
        if (store.fieldName === fieldName && store.startTime === startTime) {
          console.log(`${fieldName}:${startTime}:可预约${store.orderNum}`);
          if (store.orderNum > 0) {
            return store;
          }
        }
      }
    }
    console.log(`没有找${fieldName}:${startTime}的预约信息`);
    return;
  } catch (error) {
    console.log("查询场次具体信息 error");
    return;
  }
}

// 提交订单
async function order(opendate, ordertotal, resourceid) {
  const params = {
    userID: "", // 抓包获取
    cgId: "402881b441a660630141a712b12f0046",
    cgCode: "0020C061256",
    cgtype: "3",
    terminal: "10",
    openDate: opendate,
    ordertotal,
    os: "wx",
    queryType: "android",
    lon: "113.27333860756984",
    lat: "23.134780403969454",
    subAdress: "",
    sportsNum: "5",
    citys: "440100",
    storeIds: resourceid,
    quanid: "",
  };
  params["num" + resourceid] = "1";
  let url = "/sportinterNew/androidorder/saveOrder.do";
  try {
    console.log("开始提交订单....");
    let res = await instance.post(url, new URLSearchParams(params));
    console.log(res.data);
  } catch (error) {
    console.log("提交订单 error");
  }
}

const opendate = "2023-06-24";
const fieldName = "网球场地6";
const startTime = "09:00";

async function run() {
  let store = null;
  while (true) {
    // await getTime(opendate);
    store = await getDetail(opendate, fieldName, startTime);
    if (store) break;
    await sleep(1000);
  }
  await order(opendate, store.price0, store.resourceid);
}
run();
