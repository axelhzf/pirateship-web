"use strict";

var TraktApiClient = require("./TraktApiClient");
var YtsApiClient = require("./YtsApiClient");
var _ = require("lodash");


class ShowService {
  
  constructor() {
    this.traktApiClient = new TraktApiClient();
    this.ytsApiClient = new YtsApiClient();    
  }
  
  *findPopular() {
    return yield this.traktApiClient.showsPopular();
  }
  
  *get(imdb) {
    return yield this.traktApiClient.showSummary(imdb);
  }
  
}

module.exports = ShowService;