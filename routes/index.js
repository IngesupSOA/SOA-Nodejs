var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*
   var pizzapi=require('dominos'); // or without payment option : var pizzapi=require('pizzapi');

   pizzapi.Util.findNearbyStores(
   '63102',))
   'Delivery',
   function(storeData){
   console.log(storeData);
   }
   );
   */


  res.render('index', { title: 'Express' });
});

module.exports = router;
