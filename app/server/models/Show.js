var db = require("barbakoa").db;
var types = db.types;

module.exports = db.define("Show", {
  title: db.types.STRING,
  year: db.types.INTEGER,
  overview: db.types.TEXT,
  imdb_id: db.types.STRING,
  
  image_poster: db.types.URL,
  image_poster_thumb: db.types.URL,
  image_fanart: db.types.URL,
  image_fanart_thumb: db.types.URL,
  image_banner: db.types.URL,
  image_banner_thumb: db.types.URL
  
});