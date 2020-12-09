const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path');
const csv = require('csv-parser');
let stream = fs.createWriteStream("couponNoPre.json")

let dataObj = {};

let filePath = './xlsx/data/B1304999.xlsx'
let SheetHead = '1304999' // 表名称
let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])
dataList.forEach(item => {
  if (item["券号"]) {
    dataObj[item["券号"]] = item["密码"]
  }
})

stream.write(JSON.stringify(dataObj))
