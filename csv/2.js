var Excel = require('exceljs');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const csv = require('csv-parser');
const fileName = path.resolve('./csv/130.csv')

let dataList = [];

fs.createReadStream(fileName)
.pipe(csv())
.on('data', function(data){
    try {
      dataList.push(data);
    }
    catch(err) {
      console.log('err', err);
    }
})
.on('end',function(){
  console.log('read done');
  run()
});

let options = {
  columns: [
    { header: '经营方式', key: 'businessModeName' },
    { header: '区域', key: 'regionCodeName' },
    { header: '城市', key: 'cityCodeName' },
    { header: '管理门店', key: 'memberManageStore' },
    { header: '管理导购', key: 'memberManageClerk' },
    { header: '会员状态', key: 'status' },
    { header: '会员编号', key: 'member_no' },
    { header: '会员编码', key: 'memberCode' },
    { header: '会员卡号', key: 'memberCard' },
    { header: '会员手机号', key: 'memberMobile' },
    { header: '会员名字', key: 'memberName' },
    { header: '会员性别', key: 'memberGender' },
    { header: '会员等级', key: 'memberGradeName' },
    { header: '等级到期时间', key: 'gradeExpiration' },
    { header: '到账积分', key: 'memberScore' },
    { header: '未到账积分', key: 'memberWillScore' },
    { header: '微信ID', key: 'memberWechatId' },
    { header: '会员生日', key: 'memberBirthday' },
    { header: '入会日期', key: 'memberRegisterTime' },
    { header: '最近消费日期', key: 'memberLastOrderTime' },
    { header: '最近回访日期', key: 'lastContactTime' },
    { header: '最近等级变动时间', key: 'gradeBegin' },
    { header: '注册来源', key: 'memberRegSource' },

  ],
  fileName: '会员列表'
};

function fillWorksheet(worksheet, columnsOptions, list) {
  return new Promise((resolve, reject) => {
    worksheet.columns = columnsOptions;
    let j = 0;
    for(; j < list.length; j++) {
      let obj = {};
      for(let i = 1; i <= worksheet.columns.length; i++) {
        obj[worksheet.getColumn(i).key] = list[j][worksheet.getColumn(i).key];
      }
      worksheet.addRow(obj).commit();
    }
    resolve({endIndex: j, obj: list[j - 1]});
    worksheet.commit();
  });
}

function generatedExcelFileUsingStream(data, fileOptions){
  return new Promise(function (resolve) {
    let baseDir = 'csv/';
    let name = encodeURI(fileOptions.fileName || 'Excel') + moment(new Date()).format('YYYYMMDDHHmm') + '.xlsx';
    let path = baseDir + name;
    let writeStream = fs.createWriteStream(path);
    let options = {
      stream: writeStream,
      filename: path
    };
    let workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    //生成第一张sheet
    let worksheet = workbook.addWorksheet(fileOptions.fileName || 'Excel');

    fillWorksheet(worksheet, fileOptions.columns, data).then(resp => {
      workbook.commit().then(function () {
        console.log('使用流生产excel完成！');
        resolve(name);
      });
    });
  });
};

async function run() {
  await generatedExcelFileUsingStream(dataList, options)
}
