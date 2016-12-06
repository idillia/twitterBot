var _ = require('underscore');

var json = require("./snap_users.json");
var fs = require('fs');
var webshot = require('webshot');

var options = {
  renderDelay: 15000,
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
  for (var j = 190; j < 210; j++) {
    console.log(users.users[j].name)
    users.users[j].prof_snapshot = 'images/snapshots/' + users.users[j].screen_name + '.png';

    webshot('http://localhost:3000/screenshot/' + users.users[j].screen_name, 'images/snapshots/' + users.users[j].screen_name + '.png', options, function(err) {
      // screenshot now saved to google.png
    });
  }
  return users;
}(json)



// fs.writeFile('snap_path_users.json', JSON.stringify(snapshot, null, ' '), 'utf8', function(err) {
//     if (err) throw err;
//     console.log('file saved');
// });