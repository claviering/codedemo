const XLSX = require('xlsx')
const fs = require('fs')
let stream = fs.createWriteStream("data.json")

let filePath = './xlsx/data/ec开开店.xlsx'
let SheetHead = '工作表1' // 表名称

console.log('loading...')

let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])

let powerMap = {};
dataList.forEach(item => {
  if (item._id) {
    powerMap[item._id] = item.label
  }
})

let filePath2 = './roles.xlsx'
let SheetHead2 = 'roles' // 表名称

console.log('loading...')

let workbook2 = XLSX.readFile(filePath2)
let dataList2 = XLSX.utils.sheet_to_json(workbook2.Sheets[SheetHead2])
dataList2.forEach((item, index) => {
  if (item.power) {
    powerMap[item.applicationId] = item.label
    let powerList = JSON.parse(item.power);
    let powerNameList = powerList.map(item => {
      return powerMap[item];
    })
    let position = 'O' + (index + 2)
    workbook2.Sheets[SheetHead2][position].v = JSON.stringify(powerNameList)
  }
})
XLSX.writeFile(workbook2, 'output.xlsx');
console.log('Done');