var Joi = require("joi");
var subtitlesService = require("../services/subtitlesService");

var downloadSchema = Joi.object().required().keys({
  file: Joi.string().min(3).required()
});

exports.download = function* () {
  var body = yield this.validateBody(downloadSchema);
  this.body = yield subtitlesService.downloadSubtitles(body.file);
};