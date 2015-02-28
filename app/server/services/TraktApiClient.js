"use strict";

var Auth = require("../models/Auth");
var ApiClient = require("./ApiClient");
var _ = require("lodash");

class TraktApiClient {
  
  constructor() {
    
    //todo accessToToken
    var accessToken = "0d0140bce120dbdaeff28a2c5f50b65bb3bf21b720ba62a4c31f81e2c3d6f8a6";
    
    var apiClientOptions = {
      retry: 0,
      baseUri: "https://api-v2launch.trakt.tv/",
      request: {
        headers: {
          "trakt-api-version": 2,
          "trakt-api-key": "f64e2679607320225850c2b25f5512d8f38a6b6b824995cc202354c9b05e64f3",
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json"
        }
      }
    };
    this.apiClient = new ApiClient(apiClientOptions);
  }
  
  *moviesPopular() {
    return yield this.apiClient.get({
      path: "movies/popular",
      options: {
        cache: true,
        cacheTtl: 24 * 60 * 60
      }
    });
  }
  
  *showsPopular() {
    return yield this.apiClient.get({
      path: "shows/popular",
      qs: {
        limit: 100,
        extended: "full,images"
      },
      options: {
        cache: true,
        cacheTtl: 24 * 60 * 60
      }
    });
  }
  
  *showSummary(imdb) {
    var show = yield this.apiClient.get({
      path: `shows/${imdb}`,
      qs: {
        extended: "full,images"
      },
      options: {
        cache: true,
        cacheTtl: 7 * 24 * 60 * 60
      }
    });
    var seasons = yield this.apiClient.get({
      path: `shows/${imdb}/seasons`,
      qs: {
        extended: "full"
      },
      options: {
        cache: true,
        cacheTtl: 7 * 24 * 60 * 60
      }
    });
    show.seasons = seasons;
    

    for (var i = 0; i < seasons.length; i++) {
      var season = seasons[i];
      var episodes = yield this.apiClient.get({
        path: `shows/${imdb}/seasons/${season.number}`,
        qs: {
          extended: "full"
        },
        options: {
          cache: true,
          cacheTtl: 7 * 24 * 60 * 60
        }
      });
      season.episodes = episodes;
    }

    
    return show;
  }
  
  *movieSummary(imdb) {
    var summary = yield this.apiClient.get({
      path: `movies/${imdb}`, 
      qs: {
        extended: "full,images"
      },
      options: {
        cache: true, 
        cacheTtl: 7 * 24 * 60 * 60
      }
    });

    /*
    var translation = yield this.apiClient.get({
      path: `movies/${imdb}/translations/es`,
      options: {
        cache: true,
        cacheTtl: 7 * 24 * 60 * 60
      }
    });
    _.extend(summary, translation[0]);
    */

    return summary;
  }
  
  *search(query) {
    var searchResults = yield this.apiClient.get({
      path: "search",
      qs: {
        query: query,
        type: "movie,show"
      },
      options: {
        cache: true,
        cacheTtl: 7 * 24 * 60 * 60
      }
    });
    var summaries = [];
    for (var i = 0; i < searchResults.length; i++) {
      var searchResult = searchResults[i];
      if (searchResult.type === "movie") {
        try {
          var imdb = searchResult[searchResult.type].ids.imdb;
          if (imdb) {
            var summary = yield this.movieSummary(imdb);
            summary.type = searchResult.type;
            summaries[i] = summary;
          }
        }catch(e) {

        }
      }
    }
    
    var sortedSummaries = _.sortBy(summaries, "year").reverse();
    
    return sortedSummaries;
  }
  
  *syncGetWatched() {
    var watched = yield {
      movies: this.apiClient.get({path: "sync/watched/movies"}),
      shows: this.apiClient.get({path: "sync/watched/shows"})
    };
    return watched;
  }
  
  *syncAddToHistory(items) {
    var params = this._historyParams(items);
    return yield this.apiClient.post("sync/history", params);
  }
  
  *syncRemoveFromHistory(items) {
    var params = this._historyParams(items);
    return yield this.apiClient.post("sync/history/remove", params);
  }
  
  _historyParams(items) {
    var watchedAt = new Date().toString();
    var movies = [];
    var episodes = [];
    
    if (items.movies) {
      movies = items.movies.map(function (movie) {
        var movieItem = _.pick(movie, "ids");
        movieItem.watchedAt = watchedAt;
        return movieItem;
      });
    }
    
    if (items.episodes) {
      episodes = items.episodes.map(function (episode) {
        var episodeItem = _.pick(episode, "ids");
        episodeItem.watchedAt = watchedAt;
        return episodeItem;
      });
    }
    
    if (movies.length === 0 && episodes.length === 0) {
      throw new Error("No movies or episodes passed");
    }
    return {movies, items};
  }
  
}

module.exports = TraktApiClient;