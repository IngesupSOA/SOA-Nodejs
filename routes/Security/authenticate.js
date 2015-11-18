/**
 * Created by Ezehollar on 15/11/2015.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');



router.get('/', function(req, res, next) {
    //Lien pour la page d'inscription
    //res.redirect('/sign_up_page');
    //console.log(req.body.login);
    res.send('hello');
});

router.post('/', function(req, res, next) {
    //Lien pour la page d'inscription
    //res.redirect('/sign_up_page');
    res.send(req.body);
    res.json({rool: 'yolo'});
});


module.exports = router;