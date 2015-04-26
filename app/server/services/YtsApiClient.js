"use strict";

var ApiClient = require("./ApiClient");
var Promise = require("bluebird");
var Joi = require("joi");
var validate = Promise.promisify(Joi.validate);

class YtsApiClient {
  constructor() {
    this.apiClient = new ApiClient({
      baseUri: "https://yts.to/api/v2/"
    });
  }
  
  *listMovies(options) {
    var qs = yield validate(options, listMoviesOptionsSchema);
    return yield this.apiClient.get({
      path: "list_movies.json",
      qs: qs,
      options : {
        cache: true,
        cacheTtl: "1d"
      }
    })
  }
}

var listMoviesOptionsSchema = Joi.object().keys({
  limit : Joi.number().integer().default(20).min(1).max(50),
  page: Joi.number().integer().default(1),
  quality: Joi.string().default("All").valid(["All", "720p", "1080p", "3D"]),
  minimum_rating: Joi.number().integer().min(0).max(9),
  query_term: Joi.string(),
  genre: Joi.string(),
  sort_by: Joi.string().valid(["title", "year", "rating", "peers", "seeds", "download_count", "like_count", "date_added"]),
  order_by: Joi.string().valid(["desc", "asc"]).default("desc"),
  with_rt_ratings: Joi.boolean().default(true)
});

module.exports = YtsApiClient;