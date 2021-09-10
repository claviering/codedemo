const express = require('express')
const schedule = require('node-schedule');
const app = express()
const port = 3000

function initScheduleSyncStockPhysicalCode(timeFormat) {
  const job = schedule.scheduleJob(timeFormat, function() {
    console.log('11');
  });
}

initScheduleSyncStockPhysicalCode("3 * * * * *");

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  // 凌晨2点开始搞起
})