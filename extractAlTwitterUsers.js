var Twit = require('twit');
var moment = require('moment');
var json2csv = require('json2csv');
var config = require('./config');
var utils = require('./utils');
var fs = require('fs');
var T = new Twit(config);
var _ = require('underscore');
var alData = require('./alData.json');


var fields = ['id', 'screen_name', 'name', 'followers', 'creation_date', 'image_url', 'time_zone', 'tweets'];
var csv;
var userList = [];

var followersLimit = function(numOfFollowers) {
  if (numOfFollowers > 100 && numOfFollowers <1000) {
    return numOfFollowers;
  }
  return false;
};

var splitName = function(userName) {
  if (userName.split(' ').length > 1) {
    return userName;
  }
  return false;
};

var created6MonthMore = function(account_creation_date) {
  var sixMonthsInMilis = 1*60*24*32*6*60000; // 16588800000 milliseconds
  var date_created = moment(account_creation_date);
  var current_time = moment();
  var difference = current_time - date_created;

  return difference > sixMonthsInMilis ? true : false;
} 

var formatDate = function(dates) {
  return _.map(dates, function(date) {
    return moment(date).format("lll");
  }); 
}

var getIdFromTweets = function(tweetList) {
  var listOfUserIds = [];
  for (var i = 0; i < tweetList.statuses.length; i++){
    listOfUserIds.push(tweetList.statuses[i].user.id);
  }
  return listOfUserIds;
}

var isTweetsAlmostEveryday = function(tweetDates) {
  var differenceInDays = _.difference(utils.fithteenDaysBeforeArray(), utils.formatTweetDates(tweetDates));
  return differenceInDays.length <= 2 ? true : false;
}

var userHandlersArray = utils.extractHandlers(alData).slice(250,279);
var userHandlersParams = userHandlersArray.join();
console.log("ArrayLength", utils.extractHandlers(alData).length);

var userListParams = {
  "screen_name": userHandlersParams
};



console.log(userListParams);

//B: RETURN FILTERED TWITTER USER OBJECT 
var filterUsers = function(listOfUsers, tweetDates) {
  var userObj = {};
  if (listOfUsers) {
    for (var i= 0; i <listOfUsers.length; i++) {
      var userName = splitName(listOfUsers[i].name);
      var folowersCount = followersLimit(listOfUsers[i].followers_count);
      var creationDate = created6MonthMore(listOfUsers[i].created_at);
      var profileImageUrl = listOfUsers[i].profile_image_url;
      var profileImageUrlHttps = listOfUsers[i].profile_image_url_https;
      var profileBackgroundImageUrl = listOfUsers[i].profile_background_image_url;
      var profileBAckgroundImageUrlHttps = listOfUsers[i].profile_background_image_url_https;
      var profileBannerUrl = listOfUsers[i].profile_banner_url;
      var isEveryday = isTweetsAlmostEveryday(tweetDates);

      // if(userName && folowersCount && creationDate && userProfileImg && isEveryday){ 
      if(userName){ 
        console.log("GETTING list of users")
        userObj.id = (listOfUsers[i].id).toString();
        userObj.screen_name = listOfUsers[i].screen_name;
        userObj.name = listOfUsers[i].name;
        userObj.followers = listOfUsers[i].followers_count;
        userObj.creation_date = listOfUsers[i].created_at;
        userObj.image_url = profileImageUrl;
        userObj.time_zone = listOfUsers[i].time_zone;
        userObj.creation_date_filter = creationDate;
        userObj.is_everyday_filter = isEveryday;
        userObj.folowers_count_filter = folowersCount;
        userObj.tweets = formatDate(tweetDates);
       
        // userObj["personal_archetype"] = [];
        // userObj["strength_words"] = [];
        // userObj["personal_archetype_blend_sentences"] = [];
      }    
    }
  }
  // console.log(userObj);
  return userObj;
}
//E: RETURN FILTERED TWITTER USER OBJECT

function getName(counter) {
  return timelineParams = {
    screen_name: userHandlersArray[counter],
    count: 85
  };
}



//B: GET TWEETS, FIND USER, FILTER

T.get('users/lookup', userListParams, function(err,data,response) {
  for(var i = 0; i<data.length; i++) { 
    T.get('statuses/user_timeline', getName(i), function(err,data,response){
      var tweetDates = [];
      if(data[0]) {
        console.log("USER", data[0].user.screen_name);
        var currentUserInfo = data[0].user;
        for (var i = 0; i < data.length; i++) {
          tweetDates.push(data[i].created_at);
        }
        var filteredUsers = filterUsers([currentUserInfo], tweetDates);
        if(filteredUsers.hasOwnProperty('id')) {
          userList.push(filteredUsers);        
        }
      }
    })
  }
})
//B: GET TWEETS, FIND USER, FILTER  


//B: DISPLAY LIMIT STATUS
T.get('application/rate_limit_status')
  .catch(function(err) {
    console.log("limit_rate_error: ", err.stack)
  })
  .then(function(result) {
    console.log("SEARCH_USERS_LIMIT: ",  JSON.stringify(result.data.resources.users["/users/lookup"]));
    console.log("STATUSES_USER_TIMELINE: ",JSON.stringify(result.data.resources.statuses['/statuses/user_timeline']));

  });
//E: DISPLAY LIMIT STATUS
   
//B: SAVE TO CSV FILE
setTimeout(function(){ 
  // console.log(userList)
  // csv = json2csv({data: userList, fields:fields});
  fs.writeFile('file.json', JSON.stringify(userList, null, ' '), 'utf8', function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}, 10000);
//E: SAVE TO CSV FILE










