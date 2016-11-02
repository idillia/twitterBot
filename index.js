var Twit = require('twit');
var moment = require('moment');
var json2csv = require('json2csv');
var config = require('./config');
var fs = require('fs');
var T = new Twit(config);

var fields = ['id', 'screen_name', 'name', 'followers', 'creation_date', 'image_url', 'tweets'];
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

var filterUsers = function(listOfUsers, tweetDates) {
  var userObj = {};
  if (listOfUsers) {
    for (var i= 0; i <listOfUsers.length; i++) {
      // console.log("USERS", listOfUsers[i]);
      var userName = splitName(listOfUsers[i].name);
      var folowersCount = followersLimit(listOfUsers[i].followers_count);
      var creationDate = created6MonthMore(listOfUsers[i].created_at);
      var userProfileImg = listOfUsers[i].profile_image_url;
      if(userName && folowersCount && creationDate && userProfileImg){ 
        console.log("GETTING list of users")
        userObj.id = (listOfUsers[i].id).toString();
        userObj.screen_name = listOfUsers[i].screen_name;
        userObj.name = listOfUsers[i].name;
        userObj.followers = listOfUsers[i].followers_count;
        userObj.creation_date = listOfUsers[i].created_at;
        userObj.image_url = listOfUsers[i].profile_image_url;
        userObj.tweets = tweetDates;
      }    
    }
  }
  // console.log(userObj);
  return userObj;
}

var getIdFromTweets = function(tweetList) {
  var listOfUserIds = [];
  for (var i = 0; i < tweetList.statuses.length; i++){
    listOfUserIds.push(tweetList.statuses[i].user.id);
  }
  return listOfUserIds;
}

var isUserActive = function(userId) {

}

var tweetsParams = {
  q: "work",
  count: 8
};


T.get('search/tweets', tweetsParams) // Gett all tweets that has a specific key words
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function(result) {
    // console.log('data', result.data);
    var userIds = getIdFromTweets(result.data); // Get list of usersIds
    // console.log("usersIds", userIds);
    return userIds;
  })
  .then(function (res) {
    // console.log("is result passed: ", res);
    for(var i = 0; i<res.length; i++) {
      // console.log("user_id: ", res[i]); 
      var timelineParams = {
        user_id: res[i],
        count: 15
      };
      T.get('statuses/user_timeline', timelineParams)
        .catch(function (err) {
          console.log('caught error', err.stack)
        })
        .then (function(result) {        
          var currentUserInfo = result.data[0].user;
          // console.log("USER: ", currentUserInfo)

          var tweetDates = [];
          for (var i = 0; i<result.data.length; i++) {
            tweetDates.push(result.data[i].created_at);
          }
          console.log("tweetDates", tweetDates);

          var filteredUsers = filterUsers([currentUserInfo], tweetDates);
          if(filteredUsers.hasOwnProperty('id')) {
            userList.push(filteredUsers);
          }
  
        })
    }
  })
   

  setTimeout(function(){ 
    console.log("USER_LIST2", userList);
    csv = json2csv({data: userList, fields:fields});
    fs.writeFile('file.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
  }, 5000);
  




// T.get('users/search', userParams, userData); 


// function userData(err,data,response) {
//    var objData = filterUsers(data);
//     // console.log(objData);
//   csv = json2csv({data: objData, fields:fields});
//   fs.writeFile('file.csv', csv, function(err) {
//     if (err) throw err;
//     console.log('file saved');
//   });
// }

























