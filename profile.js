var webshot = require('webshot');

var options = {
  renderDelay: 5000
}


webshot('http://goodco.company/scrappymcgyver', 'scrappy.png', options, function(err) {
  // screenshot now saved to google.png
});

