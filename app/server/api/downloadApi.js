var Joi = require("joi");
var torrentService = require("../services/torrentService");

exports.list = function* () {
  var torrents = yield torrentService.list();
  this.body = torrents;
};

var idSchema = Joi.object().keys({
  id: Joi.number().integer().min(0).required()
});

exports.start = function* () {
  var params = yield this.validateParams(idSchema);
  var id = params.id;
  this.body = yield torrentService.start(id);
};

exports.stop = function* () {
  var params = yield this.validateParams(idSchema);
  var id = params.id;
  this.body = yield torrentService.stop(id);
};