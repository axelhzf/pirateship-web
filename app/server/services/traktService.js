var co = require("co");
var Movie = require("../models/Movie");
var Auth = require("../models/Auth");
var config = require("config");
var mrequest = require("./request");
var _ = require("underscore");
var imageService = require("./imageService");
var queue = require("../queue");
var Promise = require("bluebird");

var JOB_NAME = "trakt:fill-data-movie";
var JOB_PARALLEL = 20;

var request = require("co-request");
var barbakoa = require("barbakoa");

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
    var summary = yield mrequest.get("http://api.trakt.tv/movie/summary.json/" + apikey + "/" + movie.imdb_id);

    movie.tagline = summary.tagline;
    movie.trailer = summary.trailer;
    movie.overview = summary.overview;
    
    movie.poster = summary.images.poster;
    movie.poster_thumb = thumb(movie.poster);
    movie.background = summary.images.fanart;
    movie.background_thumb = thumb(movie.background);
    movie.watched = summary.watched;
    
    yield movie.save();

    console.log("imgserver downloadImagesForMovies with id ", movie.id);
  });
});

exports.fillDataFromMovie = function (movieId) {
  console.log("job create", JOB_NAME, movieId);
  return queue.addJob(JOB_NAME, {id: movieId});
};

function thumb(url) {
  if (url) {
    return url.replace(/original/, "thumb");
  }
}


var qs = require("qs");

barbakoa.router.get("/auth", function* () {
  var queryString = qs.stringify({
    response_type : "code",
    client_id: "f64e2679607320225850c2b25f5512d8f38a6b6b824995cc202354c9b05e64f3",
    redirect_uri: "http://localhost:3000/callback"
  });
  var url = "https://api-v2launch.trakt.tv/oauth/authorize?" + queryString;
  this.redirect(url);
});

barbakoa.router.get("/callback", function* () {
  var query = this.request.query;
  var code = query.code;
  var response = yield request({
    method: "post", 
    uri: "https://api-v2launch.trakt.tv/oauth/token",
    body: {
      code: code,
      client_id: "f64e2679607320225850c2b25f5512d8f38a6b6b824995cc202354c9b05e64f3",
      client_secret: "12390b92e7874ef7b77c6570e91d5ded54ba095ad31189abca84997b62978baf",
      redirect_uri: "http://localhost:3000/callback",
      grant_type: "authorization_code"
    },
    json: true
  });
  var auth = yield Auth.instance();
  console.log(response.body, response.statusCode);
  if (response.statusCode === 200) {
    yield auth.updateAttributes(response.body);
    this.body = response.body;
  } else {
    throw new Error("Authentication Error");
  }
});

barbakoa.router.get("/movies", function * () {
  var auth = yield Auth.instance();
  console.log(auth.access_token);
  var response = yield request({
    method: "get", 
    uri: "https://api-v2launch.trakt.tv/movies/trending",
    json: true,
    headers: {
      "trakt-api-version": 2,
      "trakt-api-key": "f64e2679607320225850c2b25f5512d8f38a6b6b824995cc202354c9b05e64f3",
      "Authorization": "Bearer " + auth.access_token,
      "Content-Type": "application/json"
    }
  });
  console.log(response.body, response.statusCode);
  this.body = {
    statusCode: response.statusCode,
    body: response.body
  };
});

exports.checkin = function (type, id) {
  //https://api-v2launch.trakt.tv
  
  
}