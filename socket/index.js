const fs = require('fs')
const ip = require('ip')
const path = require('path')
const debug = require('debug')('app')
const express = require('express')
const app = require('express')();
const router = require('express').Router()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const csv = require('csv-parser')
const sleep = require('sleep')

router.get('/', (req, res) => res.sendFile(path.resolve('./socket/index.html')))
app.use(router)
app.use(express.static(path.resolve('./socket')))

const config = {
  port: 9800,
  fileName: 'AA00001-all.csv',
  sleepTime: 2
}
let num = 1
let dataList = []

fs.createReadStream(path.resolve('./socket/', config.fileName))
  .pipe(csv())
  .on('data', function (data) {
    try {
      dataList.push({lng: data.lng, lat: data.lat})
      // sleep.sleep(config.sleepTime);
      // debug(`第${num}条数据: `, data);
      // io.emit('message', data);
      // client.on('message', function(msg){
      //   debug('from client', msg)
      // })
      // num += 1;
    } catch (err) {
      debug('Something error', err);
    }
  })
  .on('end', function () {
    debug('done');
    io.on('connection', client => {
      debug('Client Connection')
      for (let item of dataList) {
        io.emit('message', item);
      }
    });
  });

io.on('disconnect', client => {
  debug('Client disconnect')
  dataList = []
});



// DEBUG=app*,socket.io* node index.js
server.listen(config.port, () => debug(`server working on http://127.0.0.1:${config.port} http://${ip.address()}:${config.port}`))