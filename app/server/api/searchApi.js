var MovieService = require("../services/MovieService");
var movieService = new MovieService();

exports.search = function* search() {
  var query = this.query.query;
  this.body = yield movieService.search(query);
};