'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  fileStr: String
});

module.exports = mongoose.model('Thing', ThingSchema);