"use strict";

var Auth = require("../models/Auth");
var ApiClient = require("./ApiClient");

class TraktApiClient {
  
  constructor () {
    
    //todo accessToToken
    var accessToken = "3c06d8e1058b2a6157f32bcdd0d78c911845ac9d463a60b5e860c284837cd465";
    
    var apiClientOptions = {
      retry: 3,
      baseUri: "https://api-v2launch.trakt.tv/",
      headers: {
        "trakt-api-version": 2,
        "trakt-api-key": "f64e2679607320225850c2b25f5512d8f38a6b6b824995cc202354c9b05e64f3",
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    };
    this.apiClient = new ApiClient(apiClientOptions);
  }
  
  *moviesPopular() {
    return yield this.apiClient.get("movies/popular", {cache: true, cacheTtl: "1d"});
  }
  
  *movieSummary(imdb) {
    var fullResponse = yield this.apiClient.get(`movies/${imdb}?extended=full`, {cache: true, cacheTtl: "1w"});
    var imagesResponse = yield this.apiClient.get(`movies/${imdb}?extended=images`, {cache: true, cacheTttl: "1w"});
    fullResponse.images = imagesResponse.images;
    return fullResponse
  }
  
  *syncGetWatched() {
    var watched = yield {
      movies: this.apiClient.get("sync/watched/movies"),
      shows: this.apiClient.get("sync/watched/shows")
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