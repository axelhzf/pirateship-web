var barbakoa = require("barbakoa");
var r = barbakoa.router;

var movieApi = require("./api/movieApi");
var downloadApi = require("./api/downloadApi");
var torrentsApi = require("./api/torrentsApi");
var recentApi = require("./api/recentApi");
var showsApi = require("./api/showsApi");
var fileApi = require("./api/fileApi");
var playerApi = require("./api/playerApi");
var logsApi = require("./api/logsApi");
var subtitlesApi = require("./api/subtitlesApi");

r.get("/", function * () {
  var assets = barbakoa.assets.getModule("app");
  yield this.render("index", {assets: assets});
});


r.get("/api/movies", movieApi.find);
r.get("/api/movies/seeds", movieApi.findBySeeds);
r.get("/api/movies/:imdb", movieApi.get);


r.get("/api/search", require("./api/searchApi").search);

//r.get("/api/movies/:id/download/:magnet", moviesApi.download);
//r.get("/api/movies/:id/torrents/", moviesApi.torrents);

r.get("/api/downloads", downloadApi.list);
r.post("/api/downloads/:id/start", downloadApi.start);
r.post("/api/downloads/:id/stop", downloadApi.stop);

r.get("/api/torrents", torrentsApi.list);
r.get("/api/torrents/download/:magnet", torrentsApi.download);

r.get("/api/recent", recentApi.list);

r.get("/api/shows/update", showsApi.update);
r.get("/api/shows", showsApi.find);
r.get("/api/shows/:imdb", showsApi.get);


r.get("/api/files", fileApi.find);

r.get("/api/player", playerApi.play);

r.get("/api/logs", logsApi.list);

r.post("/api/subtitles", subtitlesApi.download);