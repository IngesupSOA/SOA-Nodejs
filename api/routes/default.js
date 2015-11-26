/**
 * Created by Antoine on 24/11/2015.
 */
"use strict";

var debug = require('debug')('app:routes:default' + process.pid),
    _ = require("lodash"),
    util = require('util'),
    path = require('path'),
    bcrypt = require('bcryptjs'),
    utils = require("../utils.js"),
    Router = require("express").Router,
    UnauthorizedAccessError = require(path.join(__dirname, "..", "errors", "UnauthorizedAccessError.js")),
    User = require(path.join(__dirname, "..", "models", "user.js")),
    jwt = require("express-jwt");

var authenticate = function (req, res, next) {

    console.log("Processing authenticate middleware");

    var username = req.body.username,
        password = req.body.password;
    console.log(username);
    if (_.isEmpty(username) || _.isEmpty(password)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Invalid username or password'
        }));
    }



        User.findOne({
            username: username
        }, function (err, user) {

            if (err || !user) {
                console.log(err.message);
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid username or password'
                }));
            }
            console.log("hello");
            user.comparePassword(password, function (err, isMatch) {
                if (isMatch && !err) {
                    console.log("User authenticated, generating token");
                    utils.create(user, req, res, next);
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

    router.route("/verify").get(function (req, res, next) {
        return res.status(200).json(undefined);
    });

    router.route("/logout").get(function (req, res, next) {
        if (utils.expire(req.headers)) {
            delete req.user;
            return res.status(200).json({
                "message": "User has been successfully logged out"
            });
        } else {
            return next(new UnauthorizedAccessError("401"));
        }
    });
    router.route("/login").get(function (req, res, next) {
        return res.render('default', { title: 'Express' });
        //res.json({success:true});
    });

    router.route("/login").post(authenticate, function (req, res, next) {
        return res.status(200).json(req.user);
    });

    router.unless = require("express-unless");

    return router;
};

console.log("Loaded");