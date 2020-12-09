const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'category', title: 'category'},
    {id: 'date', title: 'date'},
    {id: 'money', title: 'money'},
    {id: 'remark', title: 'remark'},
  ]
});

const data = [
  {
    category: 'Home',
    date: new Date(),
    money: 12,
    remark: 'M'
  }
];

csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));