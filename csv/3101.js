const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fileName = path.resolve('./csv/3101.csv')
var writeStream = fs.createWriteStream('./csv/3101-output.csv');

let dataObj = {};

fs.createReadStream(fileName)
.pipe(csv())
.on('data', function(data){
    try {
      let {des, id, people} = data;
      id = id.replace(/\ |\'|,/gi, '');
      let idList = id.split(':');
      let key = idList[0];
      dataObj[key] = {
        des,
        people,
        id: idList[0],
        idDes: idList[1],
      };
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
