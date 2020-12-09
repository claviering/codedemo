const fs = require('fs')

let allFiles = fs.readdirSync('./xlsx/data/demo')
console.log('allFiles', allFiles);