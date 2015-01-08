var co = require("co");

var Movie = require("../models/Movie");
var _ = require("underscore");
var parallel = require("co-parallel");
var imageService = require("./imageService");
var path = require("path");
var debug = require("debug")("moviesService");
var _s = require("underscore.string");
var request = require("./request");
var traktService = require("./traktService");


var moviesService = {

  numberOfSetsToDownload: 50,
  setLimit: 50,

  fetchFeatured: function* () {
    var currentSet = 1;
    var getNextFeaturedSet = true;
    var totalMoviesAdded = 0;

    while (getNextFeaturedSet) {
      var moviesProcessed = yield this._getFeaturedSet(currentSet);
      if (moviesProcessed !== -1) {
        totalMoviesAdded += moviesProcessed;
        currentSet++;
      } else {
        getNextFeaturedSet = false;
      }
    }
    var stats = {
      totalMoviesAdded: totalMoviesAdded
    };
    return stats;
  },

  /**
   * Download a set of movies from yts
   * @param {int} setNumber
   * @returns {int} Number of movies processed
   */
  _getFeaturedSet: function* (setNumber) {
    var url = "https://yts.re/api/list.json?sort=seeds&limit=" + this.setLimit + "&set=" + setNumber;
    debug("Get featured set %d, url %s", setNumber, url);
    var result = yield request.get(url);
    if (result.MovieList) {
      var i;
      for (i = 0; i < result.MovieList.length; i++) {
        var movieItem = result.MovieList[i];
        yield this._processMovieItem(movieItem);
      }
      debug("Featured set %d: processed %d movies", setNumber, i);
      return i;
    } else {
      debug("Featured set fail");
      return -1;
    }
  },

  _processMovieItem: function* (movieItem) {
    try {
      var movie = this._parseMovieItem(movieItem);
      var isNew = yield this._isNewMovie(movie);
      if (isNew) {
        movie = yield Movie.create(movie);
        traktService.fillDataFromMovie(movie.id);
      }
      return isNew;
    } catch (e) {
      debug("Movie error");
      console.error(e.stack);
    }
  },

  _isNewMovie: function* (movie) {
    var total = yield Movie.count({where: {yts_movie_id: movie.yts_movie_id}});
    return total === 0;
  },

  _parseMovieItem: function (movieItem) {
    return {
      imdb_id: movieItem.ImdbCode,
      title: movieItem.MovieTitleClean,
      year: movieItem.MovieYear,
      yts_magnet: movieItem.TorrentMagnetUrl,
      yts_movie_id: movieItem.MovieID,
      rating: parseFloat(movieItem.MovieRating),
      genre: movieItem.Genre
    }
  }


};

module.exports = moviesService;
