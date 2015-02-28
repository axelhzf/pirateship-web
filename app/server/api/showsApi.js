var showsService = require("../services/showsService");
var Show = require("../models/Show");
var Episode = require("../models/Episode");
var resource = require("barbakoa").api.resource;
var _ = require("underscore");

var ShowService = require("../services/ShowService");
var showService = new ShowService();

exports.find = function* () {
  this.body = yield showService.findPopular();
};

exports.get = function* () {
  this.body = yield showService.get(this.params.imdb);
};
  
  





exports.update = function* () {
  var totalTrendingShows = yield showsService.trendingShows();
  this.body = {
    totalTrendingShows: totalTrendingShows
  }
};

var showResource = resource(Show, {});

exports.list = showResource.list;