const fs = require('fs')
const XLSX = require('xlsx')
let allFiles = fs.readdirSync('./xlsx/data/demo');

var _headers = ['date', 'trips', 'up', 'start', 'number']
var _data = [];
let oneDate = []; // 一个车次的结果
let tripsName = ''; // 车次

allFiles.forEach(file => {
  let fileNameList = file.split('.');
  let fileName = fileNameList[0];
  let filePath = `./xlsx/data/demo/${fileName}.xls`
  let SheetHead = 'Sheet1' // 表名称
  
  console.log('loading...')
  
  let workbook = XLSX.readFile(filePath)
  let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])
  

  dataList.forEach(item => {
    let rowOneValue = item["旅客列车梯形密度表（ 日均 ）"];
    rowOneValue = rowOneValue.trim();
    carTimeReg = /^[A-Z]\d{2}/gi;
    // 匹配到车次
    if (carTimeReg.test(rowOneValue)) {
      let carTimeStringList = rowOneValue.split(' ');
      tripsName = carTimeStringList[0] + ' ' + carTimeStringList[1];
      // 处理完一个车次
      _data = [..._data, ...oneDate];
      oneDate = [];
    } else if (rowOneValue === '上车站') { // 插入 上车站
      let hereReg = /^[A-Z]/gi;
      for (let index = 0; index < 100; index++) {
        let itemKey = `__EMPTY_${index + 1}`;
        let itemValue = item[itemKey];
        let test = hereReg.test(itemValue);
        if (itemValue && itemValue.length === 5) {
          let onedataObj = {
            date: fileName,
            trips: tripsName,
            up: itemValue,
            start: '',
            number: ''
          }
          oneDate.push(onedataObj);
        } else {
          break;
        }
      }
    } else if (rowOneValue === '下车站') { // 插入 开店
      let startReg = /^\d{2}/gi;
      for (let index = 0; index < 100; index++) {
        let itemKey = `__EMPTY_${index + 1}`;
        if (item[itemKey] && item[itemKey].length === 5 && oneDate[index]) {
          oneDate[index].start = item[itemKey]
        } else {
          break;
        }
      }
    } else if (rowOneValue === '上车人数合计') { // 插入 上车人数
      for (let index = 0; index < 100; index++) {
        let itemKey = `__EMPTY_${index + 1}`;
        if (item[itemKey] && oneDate[index]) {
          oneDate[index].number = item[itemKey]
        } else {
          break;
        }
      }
    }
  });
})



console.log(_data);

console.log('处理头部');
var headers = _headers
  .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
  .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

console.log('处理数据中');
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

console.log('构建 workbook 对象');
// 构建 workbook 对象
var wb = {
  SheetNames: ['mySheet'],
  Sheets: {
    'mySheet': Object.assign({}, output, { '!ref': ref })
  }
};

console.log('导出数据中...');
// 导出 Excel
XLSX.writeFile(wb, 'zswoutput.xlsx');
console.log('done....');