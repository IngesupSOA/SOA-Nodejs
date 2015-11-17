/**
 * Created by Antoine on 16/11/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = require('./Models/UserDB');
//console.log(User);
var Class = mongoose.model('./Models/Class');

router.post('/', function(req, res, next) {
    //res.render('setup', { title: 'Setup Page' });
        // create a sample user
        var nick = new User({
            firstname: 'Nick',
            lastname: 'Cerminara',
            username: 'nick',
            email: 'nick.cerminara@gmail.com',
            password: 'password',
            avatar: '',
            adress: '5th Main Street Avenue, 35697 NYC, USA',
            phoneNumber: '+45 005 458 223',
            admin: true,
            class: {
                name: 'Expert 1',
                school: 'Ingésup Lyon',
                created_on: Date.now,
                updated_at: Date.now
            },
            created_on: Date.now,
            updated_at: Date.now
        });
        //console.log(nick);
        // save the sample user
        nick.save(function(err) {
            if (err) throw err;

            console.log('User saved successfully');
            res.json({ success: true });
        });
});

module.exports = router;