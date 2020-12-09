// xlsx 拆分
const XLSX = require('xlsx')
const fs = require('fs')
const splitSize = 8; // 拆分大小

let filePath = './xlsx/data/批量申请会员转移导入模板20200708.xlsx'
let SheetHead = 'sheet' // 表名称

console.log('loading...')

let workbook = XLSX.readFile(filePath)
let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])

var _headers = ['id', 'name', 'age', 'country', 'remark']
// var _data = [{
//   id: '1',
//   name: 'test1',
//   age: '30',
//   country: 'China',
//   remark: 'hello'
// },
// {
//   id: '2',
//   name: 'test2',
//   age: '20',
//   country: 'America',
//   remark: 'world'
// },
// {
//   id: '3',
//   name: 'test3',
//   age: '18',
//   country: 'Unkonw',
//   remark: '???'
// }];

// var headers = _headers
//   .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
//   .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

// var data = _data
//   .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
//   .reduce((prev, next) => prev.concat(next))
//   .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});
// // 合并 headers 和 data
// var output = Object.assign({}, headers, data);
// // 获取所有单元格的位置
// var outputPos = Object.keys(output);
// // 计算出范围
// var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

// // 构建 workbook 对象
// var wb = {
//   SheetNames: ['mySheet'],
//   Sheets: {
//     'mySheet': Object.assign({}, output, { '!ref': ref })
//   }
// };

// 导出 Excel
// XLSX.writeFile(wb, 'output.xlsx');
// XLSX.writeFile(workbook2, 'output.xlsx');