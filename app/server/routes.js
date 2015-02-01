var barbakoa = require("barbakoa");
var r = barbakoa.router;

var moviesApi = require("./api/moviesApi");
var downloadApi = require("./api/downloadApi");
var torrentsApi = require("./api/torrentsApi");
var recentApi = require("./api/recentApi");
var showsApi = require("./api/showsApi");
var fileApi = require("./api/fileApi");
var playerApi = require("./api/playerApi");

r.get("/", function * () {
  var assets = barbakoa.assets.getModule("app");
  yield this.render("index", {assets: assets});
});

r.get("/api/movies/update", moviesApi.update);
r.get("/api/movies", moviesApi.list);
r.get("/api/movies/_years", moviesApi.getYears);
r.get("/api/movies/_genres", moviesApi.getGenres);
r.get("/api/movies/:id", moviesApi.get);
r.get("/api/movies/:id/download/:magnet", moviesApi.download);
r.get("/api/movies/:id/torrents/", moviesApi.torrents);

r.get("/api/downloads", downloadApi.list);
r.post("/api/downloads/:id/start", downloadApi.start);
r.post("/api/downloads/:id/stop", downloadApi.stop);

r.get("/api/torrents", torrentsApi.list);
r.get("/api/torrents/download/:magnet", torrentsApi.download);

r.get("/api/recents", recentApi.list);

r.get("/api/shows/update", showsApi.update);
r.get("/api/shows", showsApi.list);
r.get("/api/shows/:id", showsApi.get);


r.get("/api/files", fileApi.find);

r.get("/api/player", playerApi.play);