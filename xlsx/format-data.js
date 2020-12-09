const XLSX = require('xlsx')
const moment = require('moment')

let filePath = './users.xlsx'
let SheetHead = 'users' // 表名称

console.log('loading...')

let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])

dataList.forEach((item, index) => {
  if (item.date) {
    let dateString = moment(Number(item.date)).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
    let position = 'G' + (index + 2)
    workbook.Sheets[SheetHead][position].v = dateString
  }
})
XLSX.writeFile(workbook, 'users-format-date.xlsx');
console.log('Done');