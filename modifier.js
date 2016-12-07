var _ = require('underscore');
var fileName = './backup.json';
var file = require(fileName);
var fs = require('fs');
var moment = require('moment');


var today = moment().format('LLL');


console.log(today);

for(var i=0; i<10; i++) {
file.users[i].posted_time = '';
}

fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
  if (err) return console.log(err);
});

