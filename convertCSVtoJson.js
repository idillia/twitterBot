var csv2json = require("csv2json");
var fs = require('fs');
var _ = require('underscore');


// var csvFilePath = './csv/goodco_users.csv';
// var jsonFilePathOutput = './json/goodco_random_users.json'

var csvFilePath = './csv/ylenio_tweeted_goodco.csv';
var jsonFilePathOutput = './json/ylenio_tweeted_goodco.json'


// STEP 1: Conver CSV to JSON

// STEP 2: Extract only twitter handlers and save to twitterHandlers.json


var array = [];
const csv=require('csvtojson');
csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
  var tH = [];
  array.push(jsonObj);
  var twitterHandlers = _.pluck(array, 'Screen name');
  for(var i =0; i<twitterHandlers.length; i++) {
    tH.push(twitterHandlers[i].slice(1,twitterHandlers.length)) 
  }

    var uniqueUserList = _.uniq(tH);

  fs.writeFile(jsonFilePathOutput, JSON.stringify(uniqueUserList, null, ' '), 'utf8', function(err) {
    if (err) throw err;
    // console.log('file saved');
  });
})
.on('done',(error)=>{
    console.log('end')
})