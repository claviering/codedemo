const XLSX = require('xlsx')
const axios = require('axios');
let filePath = 'xlsx/ip地址转换.xlsx'
let SheetHead = 'Sheet1' // 表名称
console.log('loading...')
let workbook = XLSX.readFile(filePath)

let token = 'a8401952e1445fe43a465cb5c6e580cc'

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
function getIpDetail(ip) {
  var param = { token, ip: ip };
  return axios({
    url: "http://api.ip138.com/ip",
    method: "get",
    params: param
  });
};

let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])
let ipList = []
dataList.forEach(item => {
  if (item.ip) {
    return ipList.push(item.ip)
  }
})
var _data = [];
async function run() {
  for (let i = 0; i < dataList.length; i++) {
    const ip = ipList[i];
    let res = null;
    try {
      res = await getIpDetail(ip)
      console.log('working on:', i);
      if (!res.status == 200 || !res.data.ret === 'ok' || !res.data.data.length) {
        console.log('change token');
        token = '24692ec7c07fe97c810842214528d28e'
        res = await getIpDetail(ip)
      }
      if (res.status == 200 && res.data.ret === 'ok' && res.data.data.length) {
        _data.push({
          ip: ip,
          country: res.data.data[0],
          province: res.data.data[1],
          city: res.data.data[2],
          district: res.data.data[3],
        })
      } else {
        _data.push({
          ip: ip,
          country: '',
          province: '',
          city: '',
          district: '',
        })
      }
      await sleep(200)
    } catch (error) {
      console.log(error);
    }
  }
  wirtefile(_data)
}
run()

function wirtefile(_data) {
  console.log('writing to file...');
  // ip 国家 省份 城市 区县
  var _headers = ['ip', 'country', 'province', 'city', 'district']
  
  var headers = _headers
    .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
  
  var data = _data
    .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
    .reduce((prev, next) => prev.concat(next))
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
  
  // 合并 headers 和 data
  var output = Object.assign({}, headers, data);
  // 获取所有单元格的位置
  var outputPos = Object.keys(output);
  // 计算出范围
  var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
  
  // 构建 workbook 对象
  var wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      'mySheet': Object.assign({}, output, { '!ref': ref })
    }
  };
  
  // 导出 Excel
  XLSX.writeFile(wb, 'ip地址转换.xlsx');
  console.log('done');
}