/**
 * Created by Ezehollar on 13/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Class = require('./ClassDB');

var User = new Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true},
    avatar: { type: String, required: true},
    address: { type: String, required: true},
    phoneNumber: { type: String, required: true},
    admin: { type: Boolean, required: true },
    class: { type: Class, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

User.pre('save', function(next){
    var now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

exports.User = mongoose.model('User', User);