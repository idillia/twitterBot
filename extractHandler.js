var alUsers = require('./alData');

var regex = /https*:\/\/[https*]*[\/\/]*[www.]*[twitter.com]*\/*#*!*\/*/;
var regexEnd = /\//;


exports.extractHandlers = function(json) {
  for(var i=0; i<json.length; i++) {
    json[i]["al_twitter_link"].replace(regex, '').replace(regexEnd, '');
  }
} 







