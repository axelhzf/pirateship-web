var barbakoa = require("barbakoa");
var events = barbakoa.events;
var router = barbakoa.router;
var postProcess = require("./services/postProcess");
var queue = require("./queue");

var app = new barbakoa();

barbakoa.mountStatic("/tmp", __dirname + "/../../tmp");

require("./routes");

events.on("post-start", function * () {
  yield postProcess.start();
  queue.start();
});

app.start();
