var Show = require("../models/Show");
var Episode = require("../models/Episode");
var _ = require("underscore");
var ShowService = require("../services/ShowService");

var showService = new ShowService();

exports.find = function* () {
  if (this.query.filter === "popular") {
    this.body = yield showService.findPopular();
  } else {
    this.body = yield showService.findFavs();
  }
};

exports.get = function* () {
  this.body = yield showService.get(this.params.imdb);
};