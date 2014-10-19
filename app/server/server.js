var pirateshipServer = require("pirateship-server");
var koa = require("koa");

var _ = require("underscore");
var co = require("co");

var views = require("koa-views");
var mount = require("koa-mount");
var staticCache = require('koa-static-cache');

var config = require("./config");
var logger = require("./logger");
var routes = require("./routes");

var app = koa();

app.use(views('views', {
  default: 'jade'
}));

app.use(mount("/api", pirateshipServer.app));

mountStatic("/assets", __dirname + '/../assets');
mountStatic("/assets", __dirname + '/../.assets');
mountStatic("/assets", __dirname + '/../client');

if (config.env === "development") {
  app.use(require("koa-logger")());
}

app.use(require("./error")());

//routes
routes.configure(app);


// server methods
var server;
exports.start = function* () {
  yield pirateshipServer.beforeStart();


  server = app.listen(config.port);

  if (config.env === "development") {
    var gulp = require("gulp");
    require("../../gulpfile");
    gulp.start("watch");
  }

};

exports.stop = function* () {
  server.close();
};


// Autostart
if (require.main === module) {
  co(function* () {
    yield exports.start()
  })();
}

// helpers
function mountStatic (url, path) {
  var assets = koa();
  assets.use(staticCache(path, {
    maxAge: 2 * 60 * 60
  }));
  app.use(mount(url, assets));
}