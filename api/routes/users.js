var express = require('express'),
    mongoose = require('mongoose'),
    User = require('../models/UserDB'),
    User = mongoose.model('User'),
    Class = mongoose.model('Class'),
    Cookies = require("cookies");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.
      find().
      exec(function(err, users){
        res.json(users);
      });
});

// TODO: Check why it throw an error (500)
router.get('/profile', function(req, res, next) {
    var cookieUser = (new Cookies(req, res).get("user")) ? JSON.parse(new Cookies(req, res).get("user")) : null ;
    console.log(cookieUser);
    res.render('profile', { user : cookieUser });
});



/* DELETE user */
router.get('/delete/:value', function(req, res, next){
  console.log(req.params.value);
  User.
      remove({_id: req.params.value}).
      exec(function(err, user){
        res.json(user);
      });
});

/* CREATE user */
router.get('/add', function(req, res, next){
  res.render('add', {title: 'Add a user'});
});

router.get('/setup', function(req, res, next) {
    //res.render('setup', { title: 'Setup Page' });
    // create a sample user
    var class1 = new Class({
        name: 'Expert 1',
        school: 'Ingesup Lyon',
        created_on: Date.now(),
        updated_at: Date.now()
    });
    var nick = new User({
        firstname: 'Nick',
        lastname: 'Cerminara',
        username: 'nick',
        email: 'nick.cerminara@gmail.com',
        password: 'password',
        avatar: 'yoloAvatar',
        address: '5th Main Street Avenue, 35697 NYC, USA',
        phoneNumber: '+45 005 458 223',
        admin: true,
        class: class1,
        created_on: Date.now(),
        updated_at: Date.now()
    }).save(function(err) {
            if (err) console.log(err);

            console.log('User saved successfully');
            res.json({ success: true });
        });
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
