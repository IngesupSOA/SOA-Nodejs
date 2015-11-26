/**
 * Created by Antoine on 24/11/2015.
 */
"use strict";

var debug = require('debug')('app:utils:' + process.pid),
    path = require('path'),
    util = require('util'),
    Cookies = require("cookies"),
    uuid = require('uuid'),
    nJwt = require('nJwt'),
    secretKey = uuid.v4(),
    _ = require("lodash"),

    TOKEN_EXPIRATION = 60 * 60,
    TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60,
    UnauthorizedAccessError = require(path.join(__dirname, 'errors', 'UnauthorizedAccessError.js')),
    NotFoundError = require(path.join(__dirname, 'errors', 'NotFoundError.js'));

module.exports.createToken = function (user, req, res, next) {
    if (_.isEmpty(user)) {
        return next(new Error('User data cannot be empty.'));
    }

    //Creating claims to build token
    var claims = {
        sub: user._id,
        iss: 'http://localhost/api',
        //TODO Handle permissions to set them accordingly to the user trying to connect
        scope: 'self api/users api/login api/verify'
    };
    console.log("Creating token...");
    var jwt = nJwt.create(claims, secretKey);
    jwt.setExpiration(new Date().getTime() + (60 * 60 * 1000)); // One hour from now
    var token = jwt.compact();
    //console.log("--> Token generated %s:", token);


    new Cookies(req, res).set('access_token', token, {
        httpOnly: true,
        secure: false      // for your dev environment => true for prod
    });
    //console.log(req);
    //console.log("Assigned token into cookie for user %s", user.username);
    //console.log('Data %o',data);
    return next();
};

module.exports.verify = function (req, res, next) {

    console.log("Verifying token");

    var token = exports.fetch(req, res);

    nJwt.verify(token, secretKey, function (err, token) {
        if (err) {
            req.user = undefined;
            return next(new UnauthorizedAccessError("invalid_token"));
        } else {
            req.user = data;
            console.log("Token has been validated");
            next();
        }
    });
};

module.exports.fetch = function (req, res, next) {
    var token = new Cookies(req, res).get('access_token');

    if (!_.isUndefined(token) && !_.isNull(token)) {
        return next(new NotFoundError("Token not defined or revoked"));
    }
    else if (_.isEmpty(token)) {
        return next(new NotFoundError("Invalid token"));
    }
    else
        return token;
};

module.exports.middleware = function () {
console.log("In tokenHandler middleware");
    var func = function (req, res, next) {

        exports.verify(req, res, next, function (err, token) {
console.log("hello");
            if (err) {
                req.user = undefined;
                console.log(err); // Token has expired, has been tampered with, etc
                return next(new UnauthorizedAccessError("invalid_token", token));
            } else {
                console.log('Token verified: OK'+token);
                req.user = _.merge(req.user, token);
                next();
            }

        });
    };

    func.unless = require("express-unless");
    console.log("hello2");
    return func;

};

module.exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
module.exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;

console.log("Loaded");