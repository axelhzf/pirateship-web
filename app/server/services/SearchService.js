"use strict";
var _ = require("lodash");
var ShowService = require("./ShowService");
var MovieService = require("./MovieService");
var TraktApiClient = require("./TraktApiClient");

class SearchService {
  
  constructor() {
    this.showService = new ShowService();
    this.movieService = new MovieService();
    this.traktApiClient = new TraktApiClient();
  }
  
  *search(query) {
    var searchResults = yield this.traktApiClient.search(query);
    console.log("seachResults", searchResults);
    var summaries = [];
    for (var i = 0; i < searchResults.length; i++) {
      var searchResult = searchResults[i];
      var imdb = searchResult[searchResult.type].ids.imdb;
      
      if (!imdb) {
        continue;
      }
      
      try {
        var summary;
        if (searchResult.type === "movie") {
          summary = yield this.movieService.get(imdb);
        } else if (searchResult.type === "show") {
          summary = yield this.showService.get(imdb);
        }
        summary.type = searchResult.type;
        summaries.push(summary);
      } catch (e) {
        // not found
      }
    }
    var sortedSummaries = _.sortBy(summaries, "year").reverse();
    return sortedSummaries;
  }
  
}

module.exports = SearchService;