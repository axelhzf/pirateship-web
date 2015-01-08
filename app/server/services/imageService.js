var co = require("co");
var request = require("request");
var path = require("path");
var fs = require("mz/fs");
var Promise = require("bluebird");
var mkdirp = Promise.promisify(require("mkdirp"));
var gm = require('gm');
var _s = require("underscore.string");

var debug = require("debug")("imageService");

var queue = require("../queue");
var Movie = require("../models/Movie");

var JOB_NAME = "imageService:download-image-for-movie";
var JOB_PARALLEL = 4;


function ImageService() {
  this.directory = __dirname + "../../../../tmp";
  this.thumbResolution = {width: 200 * 2, height: 285 * 2};
}

ImageService.prototype = {
  downloadImage: function* (url, filename) {
    debug("Downloading %s to %s", url, filename);

    var tmpDirectory = yield this.getTmpDirectory();
    var ext = path.extname(url);
    var file = path.join(tmpDirectory, filename + ext);
    yield this._downloadUrl(url, file);
    return file;
  },

  resizeImage: function * (file) {
    return yield this._resize(file, this.thumbResolution);
  },

  getTmpDirectory: function * () {
    var existDirectory = yield fs.exists(this.directory);
    if (!existDirectory) {
      yield mkdirp(this.directory);
    }
    return this.directory;
  },

  _downloadUrl: function (url, file) {
    return function (cb) {
      var r = request.get(url).pipe(fs.createWriteStream(file));
      r.on("error", function (error) {
        cb(error);
      });
      r.on("finish", function () {
        cb(null);
      });
    }
  },

  _resize: function (file, resolution) {
    return function (cb) {
      var extname = path.extname(file);
      var baseFile = file.substring(0, file.length - extname.length);
      var endFile = baseFile + "-" + resolution.width + "x" + resolution.height + extname;
      var writeStream = fs.createWriteStream(endFile);
      writeStream.on("finish", function () {
        cb();
      });
      gm(file)
        .thumb(resolution.width, resolution.height, endFile, 100, function (error) {
          cb(error, endFile);
        });
    }
  },

  downloadImagesForMovie: function (movieId) {
    queue.addJob(JOB_NAME, {id: movieId});
  }

};

var imageService = new ImageService();

queue.addWorker(JOB_NAME, JOB_PARALLEL, function (data) {
  return co(function* () {
    var movieId = data.id;
    var movie = yield Movie.find(movieId);
    if (!movie) {
      throw new Error("Movie " + movieId + " doesn't exists");
    }
    if (!movie.poster) {
      throw new Error("Movie " + movieId + " doesn't have a poster");
    }

    var poster = movie.poster;
    var imageName = movie.imdb_id + "-" +  _s.slugify(movie.title);
    var posterFile = yield imageService.downloadImage(poster, imageName);
    var posterThumbFile = yield imageService.resizeImage(posterFile);
    var backgroundFile = yield imageService.downloadImage(movie.background, imageName + "_bg");
    movie.poster = path.basename(posterFile);
    movie.poster_thumb = path.basename(posterThumbFile);
    movie.background = path.basename(backgroundFile);
    yield movie.save();
  })
});


module.exports = imageService;