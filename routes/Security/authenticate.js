/**
 * Created by Ezehollar on 15/11/2015.
 */
var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    //Lien pour la page d'inscription
    //res.redirect('/sign_up_page');
    console.log(req.body.login);
    res.send(req.body.login);
});


module.exports = router;