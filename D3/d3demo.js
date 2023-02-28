const fs = require("fs");
let axios = require("axios");

const URL = "https://api.bilibili.com/x/space/arc";
const mid = "337521240";
let ps = 50;
let pn = 1;
let list = [];
let count = 0;
function sleep() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}
async function run() {
  let res = await axios(
    URL +
      `/search?mid=${mid}&ps=${ps}&tid=0&pn=${pn}&keyword=&order=pubdate&jsonp=jsonp`
  );
  count = res.data.data.page.count;
  let vlist = res.data.data.list.vlist.map((item) => {
    return {
      created: item.created, // 发布日期，时间戳
      play: item.play, // 播放量
      title: item.title,
    };
  });
  list = [...list, ...vlist];
  console.log(list.length, "/", count);
  if (list.length === count) {
    writePlay(list)
    close(list)
    return;
  } else {
    pn++;
    await sleep();
    return run();
  }
}
run();

function writePlay(data) {
  var writeStream = fs.createWriteStream("./D3/play.json");
  data = data.reverse();
  let list = [];
  for (let i = 1; i < data.length; i++) {
    const el = data[i];
    list.push({
      date: moment(el.created * 1000).format("YYYY-MM-DD"),
      play: el.play,
    });
  }
  writeStream.write(JSON.stringify(list));
}

function close(data) {
  var writeStream = fs.createWriteStream("./D3/close.json");
  data = data.reverse();
  let list = [];
  list.push({
    date: moment(data[0].created * 1000).format("YYYY-MM-DD"),
    close: 0,
  });
  for (let i = 1; i < data.length; i++) {
    const el = data[i];
    list.push({
      date: moment(el.created * 1000).format("YYYY-MM-DD"),
      close: Math.floor((data[i].created - data[i - 1].created) / 60 / 60 / 24),
    });
  }
  writeStream.write(JSON.stringify(list));
}
