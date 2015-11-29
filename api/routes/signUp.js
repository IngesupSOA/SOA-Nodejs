/**
 * Created by Ezehollar on 15/11/2015.
 */
var express = require('express');
var router = express.Router();
//var string = require("string");
var mongoose = require("mongoose");
//var fs = require('fs');
var User = mongoose.model("User");
var Class = mongoose.model("Class");

router.get('/' , function(req, res) {
    res.redirect('/api/login');
});

router.post('/' , function(req, res)
{
    var registerErr = null;
    var m_mail = req.body.mail.toString();

    if(req.body.checkmail == m_mail)
    {
        if(req.body.checkpass == req.body.pass) {
            if (m_mail.indexOf("@ynov.com") > -1) {
                User.find({
                    email: m_mail,
                    username: req.body.username
                }).exec(function (err, result) {
                    if (result == "") {
                        var class1 = new Class({
                            name: 'Bidon',
                            school: 'Bidon',
                            created_on: Date.now(),
                            updated_at: Date.now()
                        });
                        var user = new User(
                            {
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                username: req.body.username,
                                email: m_mail,
                                password: req.body.pass,
                                avatar: "none",
                                address: req.body.address,
                                phoneNumber: req.body.phone,
                                admin: false,
                                class: class1,
                                created_on: Date.now(),
                                updated_at: Date.now(),
                            }
                        );
                        user.save(function (err) {
                            if (err)
                                console.log(err);
                            else {
                                console.log('User saved successfully');
                            }
                        });
                    }
                    else {
                        registerErr = "L'utilisateur existe déjà";
                        console.log("L'utilisateur existe déjà");
                    }
                });
            }
            else {
                registerErr = "Votre addresse mail n'est pas une addresse Ynov.";
                console.log("Votre addresse mail n'est pas une addresse Ynov.");
            }
        }else{
            registerErr = "Les deux mots de passe ne sont pas identiques";
            console.log("Les deux mots de passe ne sont pas identiques");
        }
    }
    else
    {
        registerErr = "Les deux addresses mails ne sont pas identiques";
        console.log("Les deux addresses mails ne sont pas identiques");
    }
    if(registerErr != null)
        res.render('login', {registerErr: registerErr});
    else
        res.render('login', {registerSuccess: "Merci, vous êtes bien inscrit"});
});


module.exports = router;