const host = 'http://127.0.0.1:3002/';
const options = {
  query: {
    token: 'rHaMAW@A2k#v',
    room: 'demo',
  },
  path: '/api/socketMessage'
};
const socket = require('socket.io-client')(host, options);
// var socket = io('http://itops.uat.trendygroup-it.com/', {path: '/api/socketMessage'});

socket.on('connect', () => {
  console.log(socket.id)
  console.log(socket.connected)
  let inputParams = {
    pageSize: 99999999,
    pageNumber: 1,
    oper: "message",
    orgCode: 'TRE',
  }
  socket.emit('getMessage', inputParams);
});

socket.on('send-message', (params) => {
  console.log('params', params);
});

socket.on('disconnect', function(){});

socket.on('error', function(err) {
  console.log('err', err);
});
