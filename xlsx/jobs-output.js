const XLSX = require('xlsx')

let filePath = './output.xlsx'
let SheetHead = 'roles' // 表名称

console.log('loading...')

let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])

let roleMap = {};
dataList.forEach(item => {
  if (item._id) {
    roleMap[item._id] = item.power
  }
})

let filePath2 = './jobs.xlsx'
let SheetHead2 = 'jobs' // 表名称

let workbook2 = XLSX.readFile(filePath2)
let dataList2 = XLSX.utils.sheet_to_json(workbook2.Sheets[SheetHead2])
dataList2.forEach((item, index) => {
  if (item.role) {
    let powerNameList = roleMap[item.role]
    let position = 'J' + (index + 2)
    workbook2.Sheets[SheetHead2][position].v = powerNameList
  }
})
XLSX.writeFile(workbook2, 'job-output.xlsx');
console.log('Done');