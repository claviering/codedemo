const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fileName = path.resolve('./csv/Monefy.Data.12-21-19.csv')
const openid = 'otiWl5ILUPYCyIvmrBa_jCNG5mWQ'

let dataList = [];

fs.createReadStream(fileName)
.pipe(csv())
.on('data', function(data){
    try {
      let {category, date, amount, description} = data;
      let dataObj = {
        openid,
        category,
        date,
        money: amount,
        remark: description
      };
      dataList.push(dataObj);
    }
    catch(err) {
      console.log('err', err);
    }
})
.on('end',function(){
  console.log('read done');
  writeCSV(dataList)
});

/**
 * 
 * @param {Array<Object>} data 写入文件数据
 */
function writeCSV(data) {
  // const data = [
  //   {
  //     name: 'John',
  //     surname: 'Snow',
  //     age: 26,
  //     gender: 'M'
  //   }
  // ];
  const csvWriter = createCsvWriter({
    path: './csv/out.csv',
    header: [
      {id: 'category', title: 'category'},
      {id: 'date', title: 'date'},
      {id: 'money', title: 'money'},
      {id: 'remark', title: 'remark'},
      {id: 'openid', title: '_openid'},
    ]
  });

  csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));
}
