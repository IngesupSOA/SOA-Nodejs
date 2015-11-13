/**
 * Created by Ezehollar on 13/11/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Class = new Schema({
    name: String,
    school: String,
    created_on: Date,
    updated_at: Date
});

mongoose.model('Class', Class);