var express = require('express');
var router = express.Router();

// http://pizza.dominos.fr/base/Store/GetStore/{ZIPCode}
// http://pizza.dominos.fr/la-carte/nos-pizzas

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pizza', { title: 'pizza' });
});

module.exports = router;
