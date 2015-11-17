var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/UserDB');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.
      find().
      exec(function(err, users){
        res.json(users);
      });
});

/* DELETE user */
router.get('/del/:value', function(req, res, next){
  console.log(req.params.value);
  User.
      remove({lastname: req.params.value}).
      exec(function(err, user){
        res.json(user);
      });
});

/* CREATE user */
router.get('/add', function(req, res, next){
  res.render('add', {title: 'Add a user'});
});

router.post('/add', function(req, res, next){
  new User ({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    update_at: Date.now()
  }).save(function(err, user, count){
        if(err){
          res.send(err.message);
        }
        else
          res.redirect('/users');
      });
});

/* UPDATE user */
router.get('/update/:lastname/:value', function(req, res, next){
  User.
      update({lastname: req.params.lastname},
      {$set: {
        firstname: req.params.value
      }},
      {multi:true}).
      exec(function(err, user){
        //res.json(user);
        res.redirect('/users/');
      });
});

module.exports = router;


router.get('/new', function(req, res, next) {
  new User ({
    firstname: 'Antoine',
    lastname: 'Maitre',
    age: 21,
    update_at: Date.now()
  }).save();

  res.send('User créé');
});