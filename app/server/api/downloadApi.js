var torrentService = require("../services/torrentService");

exports.list = function* () {
  var torrents = yield torrentService.list();
  this.body = torrents;
};

exports.start = function* () {
  var id = parseInt(this.params["id"], 10);
  this.body = yield torrentService.start(id);
};

exports.stop = function* () {
  var id = parseInt(this.params["id"], 10);
  this.body = yield torrentService.stop(id);
};