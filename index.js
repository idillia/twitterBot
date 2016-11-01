var Twit = require('twit');
var moment = require('moment');
var config = require('./config');

var T = new Twit(config);

var followersLimit = function(numOfFollowers) {
  if (numOfFollowers > 100 && numOfFollowers <1000) {
    return numOfFollowers;
  }
  return -1;
};

var hasName = function(userName) {
  if (userName) {
    return userName;
  }
  return -1;
};

var created6MonthMore = function(account_creation_date) {
  var sixMonthsInMilis = 1*60*24*32*6*60000;
  var date_created = moment(account_creation_date);
  var current_time = moment();
  var difference = current_time - date_created;
  console.log("difference", difference);

  return difference > sixMonthsInMilis ? true : false;

} 

var displayUsers = function(listOfUsers) {
  if (listOfUsers) {
    for (var i= 0; i <listOfUsers.length; i++) {
      if(followersLimit(listOfUsers[i].followers_count) > -1 && created6MonthMore(listOfUsers[i].created_at) && listOfUsers[i].profile_image_url){ 
        console.log(listOfUsers[i].name, listOfUsers[i].followers_count, listOfUsers[i].created_at, listOfUsers[i].profile_image_url);
      }
    }
  }
}



var params = {
  q: "goodco",
  location: 'San Francisco, CA',
  // page: 1,
  count: 2
}
// T.get('search/tweets', params, gotData); 
T.get('users/search', params, gotData); 

function gotData(err, data, response) {
  displayUsers(data);
};  


