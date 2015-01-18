var resource = require("barbakoa").api.resource;
var Recent = require("../models/Recent");

var api = resource(Recent, {});

module.exports = api;