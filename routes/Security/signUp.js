/**
 * Created by Ezehollar on 15/11/2015.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    //Lien pour la page d'inscription
    //res.redirect('/sign_up_page');
    res.render('sign_up_page', { title: 'Inscription' });
});


module.exports = router;