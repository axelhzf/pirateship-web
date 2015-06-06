"use strict";

var Auth = require("../models/Auth");
var ApiClient = require("./ApiClient");
var _ = require("lodash");

class TraktApiClient {
  
  constructor() {

  }

  *getApiClient() {
    var auth = yield Auth.instance();
    var accessToken =  auth.access_token;
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
    return new ApiClient(apiClientOptions);
  }

  *moviesPopular() {
    var apiClient = yield this.getApiClient();
    return yield apiClient.get({
      path: "movies/popular",
      options: {
        cache: true,
        cacheTtl: 24 * 60 * 60
      }
    });
  }
  
  *showsPopular() {
    var apiClient = yield this.getApiClient();
    return yield apiClient.get({
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
    var apiClient = yield this.getApiClient();
    return yield apiClient.get({
      path: `shows/${imdb}`,
      qs: {
        extended: "full,images"
      },
      options: {
        cache: true,
        cacheTtl: 7 * 24 * 60 * 60
      }
    });
  }
  
  *showSummaryExtended(imdb) {
    var show = yield this.showSummary(imdb);
    var apiClient = yield this.getApiClient();

    var seasons = yield apiClient.get({
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
      var episodes = yield apiClient.get({
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
    var apiClient = yield this.getApiClient();
    var summary = yield apiClient.get({
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
    var apiClient = yield this.getApiClient();
    return yield apiClient.get({
      path: "search",
      qs: {
        limit: 30,
        query: query,
        type: "movie,show"
      },
      options: {
        cache: true,
        cacheTtl: 7 * 24 * 60 * 60
      }
    });
  }
  
  *syncGetWatched() {
    var apiClient = yield this.getApiClient();
    var watched = yield {
      movies: apiClient.get({path: "sync/watched/movies"}),
      shows: apiClient.get({path: "sync/watched/shows"})
    };
    return watched;
  }
  
  *syncAddToHistory(items) {
    var apiClient = yield this.getApiClient();
    var params = this._historyParams(items);
    return yield apiClient.post("sync/history", params);
  }
  
  *syncRemoveFromHistory(items) {
    var apiClient = yield this.getApiClient();
    var params = this._historyParams(items);
    return yield apiClient.post("sync/history/remove", params);
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