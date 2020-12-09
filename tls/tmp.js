const fs = require('fs')
const path = require('path')

let certificate = {
  HandShake_Type: 'Certificate',
  Certificate: ''
}

let run = () => {
  let data = fs.readFileSync('./tls/server.crt')
  certificate.Certificate = data
  console.log('data', data);
  return JSON.stringify(data)
}
run()