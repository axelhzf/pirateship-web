"use strict";

var ApiClient = require("./ApiClient");

class YtsApiClient {
  constructor() {
    this.apiClient = new ApiClient({
      baseUri: "https://yts.re/api/v2/"
    });
  }
  
  *listBySeeds() {
    return yield this.apiClient.get({
      path: "list_movies.json",
      qs: {
        sort_by: "seeds",
        limit: 50,
        set: 1
      },
      options : {
        cache: true,
        cacheTtl: "1d"
      }
    })
  }
  
}

module.exports = YtsApiClient;