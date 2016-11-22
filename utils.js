var moment = require('moment');
var alUsers = require('./alData');


exports.fithteenDaysBeforeArray = function() {
  var fithteenDaysArr = [];
  var today = moment().format('L');
  for (var i=0; i<15; i++) {
    var subtractDays = moment().subtract(i,"days").format('L');
    fithteenDaysArr.push(subtractDays);
  }
  return fithteenDaysArr;
};

exports.formatTweetDates = function(unformatedDates) {
  var formatedTweetDatesArr = [];
  for (var i=0; i<unformatedDates.length; i++) {
    var formatDates = moment(unformatedDates[i], "ddd MMM DD HH:mm:ss Z YYYY").format('L');
    formatedTweetDatesArr.push(formatDates);
  }
  return formatedTweetDatesArr;
};


// GET TWITTER HANDLERS FROM ANGLE LIST JSON 

var regex = /https*:\/\/[https*]*[\/\/]*[www.]*[twitter.com]*\/*#*!*\/*/;
var regexEnd = /\//;

exports.extractHandlers = function(json) {
  var twitHandlers = [];
  for(var i=0; i<json.length; i++) {
    twitHandlers.push(json[i]["al_twitter_link"].replace(regex, '').replace(regexEnd, ''));
  }
  return twitHandlers;
} 



