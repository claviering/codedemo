const moment = require('moment');
let start = new Date('2020-03-02')
let index = 1;
let now = new Date();
while (new Date(start) <= now) {
  console.log(moment(start).format('YYYY-MM-DD'), index)
  start.setDate(start.getDate() + 1);
  index = index + 1;
}