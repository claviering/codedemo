const XLSX = require('xlsx')
// const fs = require('fs')
// let stream = fs.createWriteStream("data.txt")

let filePath = './resources.xlsx'
let SheetHead = 'resources' // 表名称
console.log('loading...')
let workbook = XLSX.readFile(filePath)
// console.log(workbook.Strings) // 获取表头
// for (let i = 0; i < workbook.Strings.length; i++) {
//   console.log(workbook.Strings[i].t);
// }
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])
// console.log('dataList', dataList); // xlsx 里面的数组对象
let wx_user_id_list = []

dataList.forEach(item => {
  if (item.wx_user_id) {
    return wx_user_id_list.push(item.wx_user_id)
  }
})
console.log('wx_user_id_list', wx_user_id_list);