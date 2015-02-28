var Fav = require("../models/Fav");

exports.add = function* () {
  var imdb = this.params.imdb;
  this.body = yield Fav.add(imdb);
};

exports.remove = function* () {
  var imdb = this.params.imdb;
  this.body = yield Fav.remove(imdb);
};