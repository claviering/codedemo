const XLSX = require('xlsx')

let filePath = './job-output.xlsx'
let SheetHead = 'jobs' // 表名称

console.log('loading...')

let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])

let roleMap = {};
dataList.forEach(item => {
  if (item._id && item.role) {
    roleMap[item._id] = JSON.parse(item.role)
  }
})

let filePath2 = './users.xlsx'
let SheetHead2 = 'users' // 表名称

let workbook2 = XLSX.readFile(filePath2)
let dataList2 = XLSX.utils.sheet_to_json(workbook2.Sheets[SheetHead2])
dataList2.forEach((item, index) => {
  if (item.job) {
    let jobList = JSON.parse(item.job)
    let jobNameList = jobList.map(job => {
      return roleMap[job]
    })
    let position = 'L' + (index + 2)
    workbook2.Sheets[SheetHead2][position].v = JSON.stringify(jobNameList)
  }
})
XLSX.writeFile(workbook2, 'users-output.xlsx');
console.log('Done');