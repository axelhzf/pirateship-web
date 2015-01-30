var co = require("co");
var Movie = require("../models/Movie");
var config = require("config");
var request = require("./request");
var _ = require("underscore");
var imageService = require("./imageService");
var queue = require("../queue");
var Promise = require("bluebird");

var JOB_NAME = "trakt:fill-data-movie";
var JOB_PARALLEL = 20;

queue.addWorker(JOB_NAME, JOB_PARALLEL, function (data) {
  return co(function* () {
    var movieId = data.id;
    var movie = yield Movie.find(movieId);
    if (!movie) {
      throw new Error("Movie " + movieId + " doesn't exists");
    }
    if (!movie.imdb_id) {
      throw new Error("Movie " + movieId + " doesn't have imdb_id");
    }
    var apikey = config.get("trakt.apikey");
    var summary = yield request.get("http://api.trakt.tv/movie/summary.json/" + apikey + "/" + movie.imdb_id);

    movie.tagline = summary.tagline;
    movie.trailer = summary.trailer;
    movie.overview = summary.overview;
    movie.poster = summary.images.poster;
    movie.background = summary.images.fanart;

    yield movie.save();

    console.log("imgserver downloadImagesForMovies with id ", movie.id);
    imageService.downloadImagesForMovie(movie.id);
    console.log("done movie", movieId);
  });
});

exports.fillDataFromMovie = function (movieId) {
  console.log("job create", JOB_NAME, movieId);
  return queue.addJob(JOB_NAME, {id: movieId});
};