var barbakoa = require("barbakoa");

var events = barbakoa.events;
var router = barbakoa.router;
var postProcess = require("./services/postProcess");
var queue = require("./queue");
var heapdump = require('heapdump');

var app = new barbakoa();

barbakoa.mountStatic("/tmp", __dirname + "/../../tmp");

require("./routes");

var TraktAuth = require("./services/TraktAuth");
var traktAuth = new TraktAuth(barbakoa.router);
traktAuth.initializeRoutes();

events.on("post-start", function * () {
  yield postProcess.start();
  queue.start();
});

module.exports = app;

if (require.main === module) {
  app.start();
}

