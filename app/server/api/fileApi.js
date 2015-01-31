var Joi = require("joi");
var config = require("config");
var fileService = require("../services/fileService");

var findSchema = Joi.object().keys({
  query: Joi.string().required()
});

exports.find = function* () {
  var query = yield this.validateQuery(findSchema);
  var findResult = yield fileService.find(query.query);
  this.body = findResult;
};