var db = require("barbakoa").db;

module.exports = db.define("Movie", {
  imdb_id: db.types.STRING,
  title: db.types.STRING,
  year: db.types.INTEGER,
  yts_movie_id: db.types.STRING,
  yts_magnet: db.types.URL,
  tagline: db.types.TEXT,
  trailer: db.types.URL,
  overview: db.types.TEXT,
  poster: db.types.URL,
  poster_thumb: db.types.URL,
  rating: db.types.FLOAT,
  genre: db.types.STRING
}, {
  classMethods: {
    getYears: function () {
      return db.query("select distinct year from Movies order by year desc", null, {raw: true});
    },
    getGenres: function () {
      return db.query("select distinct genre from Movies order by genre asc", null, {raw: true});
    }
  }
});