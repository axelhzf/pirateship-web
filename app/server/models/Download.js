var db = require("barbakoa").db;

var Download = db.define("Download", {
  hash: db.types.STRING(1024),
  movie_id: db.types.INTEGER
}, {
  classMethods: {
    createFromMovie: function* (movieId, magnet) {
      //parse magnet
      var regexp = /xt=urn:btih:(.*?)&/;
      var match = regexp.exec(magnet);
      if (!match) {
        throw new Error("Invalid magnet format");
      }
      var hash = match[1];
      return yield Download.create({movie_id: movieId, hash: hash});
    }
  }
});

module.exports = Download;