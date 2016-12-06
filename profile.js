var webshot = require('webshot');

var options = {
  renderDelay: 10000,
  screenSize: {
    width: 500
  , height: 565
  },
   shotSize: {
    width: 500
  , height: 545
  }
}


webshot('http://localhost:3000/screenshot/scrappymcgyver', 'scrappy.png', options, function(err) {
  // screenshot now saved to google.png
});

