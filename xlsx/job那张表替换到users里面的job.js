// job那张表替换到users里面的job
const fs = require('fs')
const XLSX = require('xlsx')

let config = {
  input: {
    filePath: './xlsx/data/jobs.xlsx',
    SheetHead: 'jobs', // 表名称
    mapKey: '_id', // xlsx 里 key 的列名
    mapValue: 'name', // xlsx 里 value 的列名
  },
  output: {
    filePath: './xlsx/data/users.xlsx',
    SheetHead: 'users', // 表名称
    position: 'J', // 要替换数据列的位置
    key: 'job', // 要替换的列名, 里面是数组结果
  },
  outputFilePath: './xlsx/data/job那张表替换到users里面的job.xlsx'
}

console.log('Loading...');

let workbook = XLSX.readFile(config.input.filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[config.input.SheetHead])

let powerMap = {};
dataList.forEach(item => {
  let key = config.input.mapKey;
  if (item[key]) {
    powerMap[item[key]] = item[config.input.mapValue]
  }
});

console.log('Loading...');


let workbook2 = XLSX.readFile(config.output.filePath)
let dataList2 = XLSX.utils.sheet_to_json(workbook2.Sheets[config.output.SheetHead])
dataList2.forEach((item, index) => {
  let outputKey = config.output.key;
  if (item[outputKey]) {
    let dataList = JSON.parse(item[outputKey]);
    let dataNameList = dataList.map(item => {
      return powerMap[item];
    })
    let position = config.output.position + (index + 2)
    workbook2.Sheets[config.output.SheetHead][position].v = JSON.stringify(dataNameList)
  }
})

XLSX.writeFile(workbook2, config.outputFilePath);

console.log('Done');