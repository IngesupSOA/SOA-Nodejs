/**
 * Created by Ezehollar on 18/11/2015.
 */
var express = require('express');
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken');

var config = require('./config.js'); // get our config file
var users = require('./routes/users');
var setup = require('./routes/setup');
//var authenticate = require('./routes/authenticate');


var router = express.Router();
var User = mongoose.model('User');
var app = express();
app.set('superSecret', config.secret); // secret variable


// route to authenticate a user (POST http://localhost:3000/authenticate)
router.post('/authenticate', function(req, res, next) {

    // find the user
    User.findOne({
        username: req.body.login
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 28800 // expires in 8 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    key: app.get('superSecret'),
                    token: token,

                });
            }
        }

    });
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['token'];
    console.log(token);
    // decode token
    if (!token && req.path == '/signUp')
        res.render('signUpPage', { title: 'Express' });
    else if(!token)
        res.render('index', { title: 'Express' });

    else if(token) {
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        }
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------

app.use('/users', users);
app.use('/setup', setup);


module.exports = router;
