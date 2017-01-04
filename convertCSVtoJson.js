var csv2json = require("csv2json");
var fs = require('fs');
var _ = require('underscore');


var csvFilePath = './csv/INFJ_5848.csv';
var jsonFilePathOutput = './json/twitterHandlers.json'


// STEP 1: Conver CSV to JSON

// STEP 2: Extract only twitter handlers and save to twitterHandlers.json


var array = [];
const csv=require('csvtojson');
csv()
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
  array.push(jsonObj);
  var twitterHandlers = _.pluck(array, 'Screen name');

  fs.writeFile(jsonFilePathOutput, JSON.stringify(twitterHandlers, null, ' '), 'utf8', function(err) {
    if (err) throw err;
    // console.log('file saved');
  });
})
.on('done',(error)=>{
    console.log('end')
})