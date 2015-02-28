"use strict";

var TraktApiClient = require("./TraktApiClient");
var YtsApiClient = require("./YtsApiClient");
var _ = require("lodash");
var Fav = require("../models/Fav");

class ShowService {
  
  constructor() {
    this.traktApiClient = new TraktApiClient();
    this.ytsApiClient = new YtsApiClient();
  }
  
  *findFavs() {
    var imdbCodes = yield Fav.all();
    var summaries = [];
    for (var i = 0; i < imdbCodes.length; i++) {
      var imdbCode = imdbCodes[i];
      var summary = yield this.traktApiClient.showSummary(imdbCode);
      summary.favorite = true;
      summaries[i] = summary;
    }
    return summaries;
  }
  
  *findPopular() {
    var shows = yield this.traktApiClient.showsPopular();
    var favs = yield Fav.all();
    
    _.each(shows, function (show) {
      show.favorite = _.includes(favs, show.ids.imdb);
    });
    
    return shows;
  }
  
  *get(imdb) {
    var summary = yield this.traktApiClient.showSummary(imdb);
    summary.favorite = yield Fav.exists(summary.ids.imdb);
    return summary;
  }
  
  *getExtended(imdb) {
    var summary = yield this.traktApiClient.showSummaryExtended(imdb);
    summary.favorite = yield Fav.exists(summary.ids.imdb);
    return summary;
  }

}

module.exports = ShowService;