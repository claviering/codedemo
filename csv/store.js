const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fileName = path.resolve('./csv/store.csv')
var writeStream = fs.createWriteStream('./csv/store-output.csv');

let dataObj = {};

fs.createReadStream(fileName)
.pipe(csv())
.on('data', function(data){
    try {
      let {name, store} = data;
      dataObj[store] = name;
    }
    catch(err) {
      console.log('err', err);
    }
})
.on('end',function(){
  console.log('read done');
  console.log(dataObj);
  writeStream.write(JSON.stringify(dataObj))
});
