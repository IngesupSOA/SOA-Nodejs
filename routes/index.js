var express = require('express');
var https = require('https');
var router = express.Router();

router.get('/', function(req, res, next) {

  var optionsget = {
    host : 'services.dominos.com.au',
    path : '/Rest/fr/menus/31740/products',
    method : 'GET'
  };
  var getData = https.request(optionsget, function(data) {
    var body = '';
    data.on('data', function(resx) {
      body += resx;
    });
    data.on('end', function() {
      console.log('ending http request');
      var bodyParsed = JSON.parse(body);
      var pizzas = bodyParsed.MenuPages[1].SubMenus;
      res.render('pizza', { menus: pizzas });
    });
  });

  getData.end();

  getData.on('error', function(e) {
    console.error("Error: "+e);
  });

});

router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
