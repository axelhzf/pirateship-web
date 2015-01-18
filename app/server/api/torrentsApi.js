var torrentsService = require("../services/torrentService");
var Joi = require("joi");

var torrentsSchema = Joi.object().keys({
  query: Joi.string().min(3).required()
});

exports.list = function * () {
  var query = yield this.validateQuery(torrentsSchema);
  var torrents = yield torrentsService.find(query.query);
  this.body = torrents;
};


var downloadParamsSchema = Joi.object().keys({
  magnet: Joi.string().min(10).required()
});

exports.download = function * () {
  var params = yield this.validateParams(downloadParamsSchema);
  this.body = yield torrentsService.download(params.magnet);
};