var showsService = require("../services/showsService");
var Show = require("../models/Show");
var Episode = require("../models/Episode");
var resource = require("barbakoa").api.resource;
var _ = require("underscore");

exports.update = function* () {
  var totalTrendingShows = yield showsService.trendingShows();
  this.body = {
    totalTrendingShows: totalTrendingShows
  }
};

var showResource = resource(Show, {});

exports.list = showResource.list;

exports.get = function* () {
  var id = parseInt(this.params["id"], 10);
  var show = yield Show.findOne(id);
  if (!show) {
    return this.throw("Resource doesn't exists", 404);
  }
  var episodes = yield Episode.findAll({where: {ShowId: id}});
  show = show.toJSON();
  show.episodes = episodes.map(function (episode) {
    return episode.toJSON();
  });
  this.body = show;
};