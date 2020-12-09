const XLSX = require('xlsx')
const axios = require('axios');
let filePath = '../../Downloads/m60托管.xlsx'
let SheetHead = 'Sheet1' // 表名称
console.log('loading...')
let workbook = XLSX.readFile(filePath)

let dataList = XLSX.utils.sheet_to_json(workbook.Sheets[SheetHead])
let wx_user_id_list = []
dataList.forEach(item => {
  if (item.wx_user_id) {
    return wx_user_id_list.push(item.wx_user_id)
  }
})
console.log('wx_user_id_list', wx_user_id_list);
async function run() {
  let url = 'http://127.0.0.1:3000/deleteWechatUser.fp'
  for (let index = 0; index < wx_user_id_list.length; index++) {
    const element = wx_user_id_list[index];
    let useridlist = [element]
    let params = {
      useridlist: useridlist
    }
    let res = await axios.post(url, params)
    console.log(index, res.data.body);
  }
}
run()