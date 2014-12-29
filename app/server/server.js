var barbakoa = require("barbakoa");
var events = barbakoa.events;
var router = barbakoa.router;
var postProcess = require("./services/postProcess");
var queue = require("./queue");

var app = new barbakoa();

require("./routes");

events.on("post-start", function * () {
  yield postProcess.start();
  queue.start();
});

app.start();
