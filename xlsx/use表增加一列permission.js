// use表增加一列permission
const fs = require('fs')
const XLSX = require('xlsx')

const headKeyList = [
  '_id',
  'userName',
  'nameCN',
  'nameEN',
  'email',
  'name',
  'password',
  'comments',
  'businessMode',
  'job',
  'auth',
  'enable',
  'logo',
  'date',
  'enterprise',
  'brandId',
  '__v',
  'id',
  'loginInfo',
  'group',
  'permission',
]

function getCharCol(n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
  let s = '';
  let m = 0;
  while (n >= 0) {
    m = n % 26 + 1;
    s = String.fromCharCode(m + 64) + s;
    n = (n - m) / 26;
  }
  return s;
}

// 生成表格
function newsheets(dataList) {
  if (!dataList || !dataList.length) return false;
  let sheet = {
    '!ref': 'A1:A1', // 范围
    'A1': {v:'a'}, // 内容
  };
  let pos = '';
  // 生成表头
  headKeyList.forEach((headKey, index) => {
    let pos = getCharCol(index) + '1';
    sheet[pos] = {v: headKey};
  })
  // 生成内容
  dataList.forEach((item, index) => {
    headKeyList.forEach((headKey, colIndex) => {
      pos = getCharCol(colIndex) + Number.parseInt((index + 2));
      sheet[pos] = {v: item[headKey]};
    })
  });
  sheet["!ref"] = 'A1:' + pos;
  return sheet;
}

let config = {
  input_0: {
    filePath: './xlsx/data/resouces那张表替换到role里面的power.xlsx',
    SheetHead: 'roles', // 表名称
    mapKey: '_id', // xlsx 里 key 的列名
    mapValue: 'power', // xlsx 里 value 的列名
  },
  input: {
    filePath: './xlsx/data/jobs.xlsx',
    SheetHead: 'jobs', // 表名称
    mapKey: '_id', // xlsx 里 key 的列名
    mapValue: 'role', // xlsx 里 value 的列名
  },
  output: {
    filePath: './xlsx/data/users.xlsx',
    SheetHead: 'users', // 表名称
    newColKey: 'permission', // 增加一列的关键词
    key: 'job', // 要获取数据的列名, 里面是数组结果
  },
  outputFilePath: './xlsx/data/use表增加一列permission.xlsx'
}

console.log('Loading...');

let workbook = XLSX.readFile(config.input_0.filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[config.input_0.SheetHead])

let dataMap = {};
dataList.forEach(item => {
  let key = config.input_0.mapKey;
  if (item[key]) {
    dataMap[item[key]] = item[config.input_0.mapValue]
  }
});

console.log('Loading...');

workbook = XLSX.readFile(config.input.filePath)
dataList = XLSX.utils.sheet_to_json(workbook.Sheets[config.input.SheetHead])

dataList.forEach(item => {
  let key = config.input.mapKey;
  if (item[key]) {
    dataMap[item[key]] = dataMap[item[config.input.mapValue]]
  }
});

console.log('Loading...');


workbook = XLSX.readFile(config.output.filePath)
dataList = XLSX.utils.sheet_to_json(workbook.Sheets[config.output.SheetHead])
dataList = dataList.map(item => {
  let outputKey = config.output.key;
  if (!item[outputKey]) return;
  let dataItemList = JSON.parse(item[outputKey]);
  let dataNameList = [];
  dataItemList.forEach(item => {
    dataNameList = [...dataNameList, ...JSON.parse(dataMap[item])];
  });
  item[config.output.newColKey] = JSON.stringify(dataNameList);
  return item;
});
let sheets = newsheets(dataList)
workbook.Sheets[config.output.SheetHead] = sheets;
XLSX.writeFile(workbook, config.outputFilePath);

console.log('Done');