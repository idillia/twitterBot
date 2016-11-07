var moment = require('moment');

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
      var formatDates = moment(unformatedDates[i]).format('L');
      formatedTweetDatesArr.push(formatDates);
    }
    return formatedTweetDatesArr;
  };
