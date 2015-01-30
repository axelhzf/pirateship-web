var db = require("barbakoa").db;
var Show = require("./Show");

var Episode = db.define("Episode", {
  season: db.types.INTEGER,
  number: db.types.INTEGER,
  title: db.types.STRING,
  overview: db.types.TEXT,
  first_aired: db.types.DATE,
  image_screen: db.types.URL,
  image_screen_thumb: db.types.URL,
  rating: db.types.INTEGER
});

Episode.belongsTo(Show);

module.exports = Episode;



