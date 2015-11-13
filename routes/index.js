var express = require('express');
var dominos = require('pizzapi/dominos-pizza-api');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  pizzapi.Util.findNearbyStores(
      '69007',
      'Delivery',
      function(storeData) {
        console.log('\n\n##################\nNearby Stores\n##################\n\n',storeData.result.Stores);
      }
  );

  res.render('index', { title: 'Express' });
});


module.exports = router;
