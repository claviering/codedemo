const XLSX = require('xlsx')
const fs = require('fs')
let stream = fs.createWriteStream("data.json")

let filePath = './xlsx/data/成本中心.xlsx'
let SheetHead = '工作表1' // 表名称

console.log('loading...')

let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])

dataList = dataList.map(item => (
  {
    departmentName: item.DepartmentName,
    costCenterName: item.CostCenterName,
    costCenterDescription: item.CostCenterDescription,
  }
))
stream.write(JSON.stringify(dataList))