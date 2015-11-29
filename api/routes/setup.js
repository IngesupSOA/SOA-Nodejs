/**
 * Created by Antoine on 16/11/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/UserDB');
var User = mongoose.model('User');
//console.log(User);
var Class = mongoose.model('Class');

router.get('/setup', function(req, res) {
    var class1 = new Class({
        name: 'Expert 1',
        school: 'Ingésup Lyon',
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