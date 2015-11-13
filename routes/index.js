var express = require('express');
var router = express.Router();

// http://pizza.dominos.fr/base/Store/GetStore/{ZIPCode}
// http://pizza.dominos.fr/la-carte/nos-pizzas

/* GET home page. */
router.get('/', function(req, res, next) {
  // test
  res.render('index', { title: 'Express' });
});

module.exports = router;
