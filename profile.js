var _ = require('underscore');

var json = require("./san_users.json");
var fs = require('fs');
var webshot = require('webshot');

var options = {
  renderDelay: 10000,
  screenSize: {
    width: 500,
    height: 485
  },
  shotSize: {
    width: 500,
    height: 485
  }
}

var snapshot = function(users){
  var str;
  for (var j = 0; j < 10; j++) {
    console.log("before clearing: ", users.users[j].prof_snapshot);
    users.users[j].prof_snapshot = 'images/snapshots/' + users.users[j].screen_name + '.png';
    console.log("after clearing: ", users.users[j].prof_snapshot);
  

    webshot('http://localhost:3000/screenshot/' + users.users[j].screen_name, 'images/snapshots/' + users.users[j].screen_name + '.png', options, function(err) {
      // screenshot now saved to google.png
    });
  }
  return users;
}(json)



fs.writeFile('snap_users.json', JSON.stringify(snapshot, null, ' '), 'utf8', function(err) {
    if (err) throw err;
    console.log('file saved');
});