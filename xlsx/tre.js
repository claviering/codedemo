const XLSX = require('xlsx')
const fs = require('fs')

let filePath = './xlsx/data/需处理埋点.xlsx'
let SheetHead = 'Sheet1' // 表名称

console.log('loading...')

let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])

let powerMap = {};
dataList.forEach((item, index) => {
  let key = item['手机号'];
  if (key) {
    powerMap[key] = (powerMap[key] + 1) || 1;
    let position = 'F' + (index + 2);
    let click_type = powerMap[key] % 2 > 0 ? 1 : 2;
    let p = workbook.Sheets[SheetHead][position];
    p.v = click_type
  }
})

XLSX.writeFile(workbook, '需处理埋点-output.xlsx');
console.log('Done');