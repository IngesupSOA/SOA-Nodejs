var express = require('express'),
    mongoose = require('mongoose'),
    User = require('../models/UserDB'),
    User = mongoose.model('User'),
    Class = mongoose.model('Class'),
    bcrypt = require("bcryptjs"),
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
    var cookieUser = JSON.parse(new Cookies(req, res).get("user"));
    res.render('profile', { user : cookieUser });
});

/* DELETE user */
router.get('/delete/:value', function(req, res, next){
    //utils.middleware(true, req, res, function() {
        console.log(req.params.value);
        User.
            remove({_id: req.params.value}).
            exec(function(err, user){
                res.json(user);
            });
    //});
});

router.post('/updUser', function(req, res, next) {

    console.log(req.body.password);

    if(req.body.password == '')
    {
        console.log('ok');
    }

    User.
         update({
            _id: req.body.userId
        },
        {$set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber
        }},
        {multi: true}
        ).exec(function(err) {
            if (err) console.log(err.message);
        });

    if(req.body.password == '')
    {
        User.findOne({_id: req.body.userId}, function(err,user) {
            if(err) console.log(err.message);

            new Cookies(req, res).set('user', JSON.stringify(user), {
                httpOnly: true,
                secure: false      // for your dev environment => true for prod
            });
            res.redirect('/api/users/profile');
        });
    }
    else
    {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                if (req.body.password != '')
                {
                    User.
                            update(
                            {_id: req.body.userId},
                            {$set: {password: hash}}
                    ).exec(function (err, user) {
                            if(err) console.log(err.message);

                            User.findOne({_id: req.body.userId}, function(err,user) {
                                if(err) console.log(err.message);

                                new Cookies(req, res).set('user', JSON.stringify(user), {
                                    httpOnly: true,
                                    secure: false      // for your dev environment => true for prod
                                });
                                res.redirect('/api/users/profile');
                            });
                    });
                }
            });
        });

    }


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

module.exports = router;
