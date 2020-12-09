const XLSX = require('xlsx')
const axios = require('axios');
let filePath = '../../Downloads/需要取消的单号.xlsx'
let SheetHead = 'Sheet1' // 表名称
console.log('loading...')
let workbook = XLSX.readFile(filePath)

let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])
let orderNoList = []
dataList.forEach(item => {
  if (item.orderNo) {
    orderNoList.push(item.orderNo)
  }
})
async function run() {
  let url = 'http://10.4.8.146:8080//stock/logic/order/cancel'
  for (let index = 0; index < orderNoList.length; index++) {
    const orderNo = orderNoList[index];
    let params = {
      "notifyType": 0,
      "orderNo": orderNo
    }
    let res = await axios.post(url, params)
    console.log(index, orderNo, res.data.message);
  }
}
run()