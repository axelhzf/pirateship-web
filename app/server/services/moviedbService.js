var co = require("co");
var Movie = require("../models/Movie");
var config = require("config");
var request = require("./request");
var _ = require("underscore");
var imageService = require("./imageService");
var queue = require("../queue");
var Promise = require("bluebird");
Promise.longStackTraces();
var moviedb = Promise.promisifyAll(require('moviedb')('7983694ec277523c31ff1212e35e5fa3'));

var debug = require("debug")("moviedb");

var JOB_NAME = "moviedb:metadata";
var JOB_PARALLEL = 5;

function* worker(data) {
  var movieId = data.id;

  debug("worker init %d", movieId);

  var movie = yield Movie.find(movieId);
  if (!movie) {
    throw new Error("Movie " + movieId + " doesn't exists");
  }
  if (!movie.imdb_id) {
    throw new Error("Movie " + movieId + " doesn't have imdb_id");
  }

  var metadata = yield getMoviedbMeta(movie.imdb_id);
  debug("get metadata %d", movieId);

  _.extend(movie, metadata);
  yield movie.save();
  debug("movie saved %d", movieId);

  debug("next Job %d %d", movieId, movie.id);
  imageService.downloadImagesForMovie(movieId);

}

function* getMoviedbMeta(imdb_id) {
  var findResponse = yield moviedb.findAsync({id: imdb_id, external_source: "imdb_id"});
  if (findResponse.movie_results.length === 0) {
    throw new Error("Movie " + imdb_id + " not found at moviedb");
  }
  var movieId = findResponse.movie_results[0].id;
  var infoResponse = yield moviedb.movieInfoAsync({id: movieId});

  var metadata = {};
  var baseUrl = 'http://image.tmdb.org';
  var poster_size = "/t/p/w342";
  var backdrop_size = "/t/p/w1920";

  metadata.poster = baseUrl + poster_size + infoResponse.poster_path;
  metadata.background = baseUrl + backdrop_size + infoResponse.backdrop_path;
  metadata.overview = infoResponse.overview;

  var trailers = yield moviedb.movieTrailersAsync({id: movieId});
  if (trailers.youtube.length > 0) {
    metadata.trailer = trailers.youtube[0].source;
  }
  return metadata;
}

exports.getMoviedbMeta = getMoviedbMeta;

queue.addWorker(JOB_NAME, JOB_PARALLEL, function (data) {
  return co(function* () {
    yield worker(data);
  });
});

exports.fillMetadataFromMovie = function (movieId) {
  return queue.addJob(JOB_NAME, {id: movieId});
};