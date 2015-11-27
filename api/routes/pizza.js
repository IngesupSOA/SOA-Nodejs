var express = require('express');
var router = express.Router();
var https = require('https');
// http://pizza.dominos.fr/base/Store/GetStore/{ZIPCode}
// http://pizza.dominos.fr/la-carte/nos-pizzas

/* GET home page. */
router.get('/', function (req, res, next) {
    var optionsget = {
        host: 'services.dominos.com.au',
        path: '/Rest/fr/menus/31740/products',
        method: 'GET'
    };
    var getData = https.request(optionsget, function (data) {
        var body = '';
        data.on('data', function (resx) {
            body += resx;
        });
        data.on('end', function () {
            console.log('ending http request');
            var bodyParsed = JSON.parse(body);
            var pizzas = bodyParsed.MenuPages[1].SubMenus;
            res.render('pizza', {menus: pizzas});
        });
    });

    getData.end();

    getData.on('error', function (e) {
        console.error("Error: " + e);
    });
});

module.exports = router;
