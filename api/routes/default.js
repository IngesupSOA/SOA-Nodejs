/**
 * Created by Antoine on 24/11/2015.
 */
"use strict";
var mongoose = require('mongoose');
var debug = require('debug')('app:routes:default' + process.pid),
    _ = require("lodash"),
    util = require('util'),
    path = require('path'),
    utils = require("../Utils/utils.js"),
    config = require("../Utils/config.js"),
    Router = require("express").Router,
    UnauthorizedAccessError = require(path.join(__dirname, "..", "errors", "UnauthorizedAccessError.js")),
    //User = require(path.join(__dirname, "..", "models", "userDB.js")),
    User = mongoose.model('User'),
    jwt = require("express-jwt"),
    unless = require('express-unless');

var authenticate = function (req, res, next) {

    console.log("Processing authenticate middleware");

    var username = req.body.username,
        password = req.body.password;
    //console.log(username);
    //console.log(password);
    if (_.isEmpty(username) || _.isEmpty(password)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Invalid username or password'
        }));
    }

    User.findOne({
        username: username
    }, function (err, user) {
        //console.log(user);
        if (err || !user) {
            console.log(err);
            return next(new UnauthorizedAccessError("401", {
                message: 'Invalid username or password'
            }));
        }

        user.comparePassword(password, function (err, isMatch) {
            if (isMatch && !err) {
                console.log("User authenticated, generating token");
                utils.createToken(user, req, res,next);
                console.log('Token set, going next...');
                next();
            } else {
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid username or password'
                }));
            }
        });
    });


};

module.exports = function () {

    var router = new Router();

    router.route("/logout").get(function (req, res, next) {
        res.clearCookie('access_token');
        return res.redirect('/api/login/');
    });
    router.route("/login").get(function (req, res) {
        return res.render('login', {title: 'Login'});
    });


    router.route("/login").post(authenticate, function (req, res) {
        //router.use(utils.middleware());
        return res.redirect('/api/pizza/');
    });


    router.route("/verify").get(function (req, res, next) {
        //router.use(utils.middleware());
        return res.status(200).json({working:true});
    });




    router.unless = require("express-unless");

    return router;
};

console.log("Loaded");