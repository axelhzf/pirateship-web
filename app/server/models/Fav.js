var db = require("barbakoa").db;
var _ = require("lodash");

var t = db.types;

var Fav = db.define("Fav", {
  imdb: t.STRING
}, {
  classMethods: {
    exists: function* (imdb) {
      var fav = yield Fav.find({where: {imdb: imdb}});
      return !!fav;
    },
    add: function* (imdb) {
      if (yield this.exists(imdb)) {
        return false;
      }
      yield Fav.create({imdb: imdb});
      return true;
    },
    remove: function* (imdb) {
      var existingFav = yield Fav.find({where: {imdb: imdb}});
      if (!existingFav) {
        return false;
      }
      yield Fav.destroy({where: {imdb: imdb}});
      return true;
    },
    all: function* () {
      var favs = yield Fav.findAll();
      return _.pluck(favs, "imdb");
    }
  }
});

module.exports = Fav;