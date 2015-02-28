var SearchService = require("../services/SearchService");
var searchService = new SearchService();

exports.search = function* search() {
  var query = this.query.query;
  this.body = yield searchService.search(query);
};