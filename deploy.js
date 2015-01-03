var Connection = require("ssh2");
var co = require("co");
var Promise = require("bluebird");
var debug = require("debug")("deploy");
var _ = require("underscore");
var fs = require("fs");
var exec = require('mz/child_process').exec;
var childProcess = require('child_process');
var SSHane = require("sshane");

function spawn (cmd) {
  var parts = cmd.split(/\s+/);
  var args = [parts[0], parts.slice(1)];
  var cmd = args.join(" ");
  debug("Running %s", cmd);
  return new Promise(function (resolve, reject) {
    var command = childProcess.spawn.apply(null, args);
    command.stdout.on("data", function (data) {
      console.log(data.toString());
    });
    command.stderr.on("data", function (data) {
      console.log(data.toString());
    });

    command.on("close", function (code) {
      if(code !== 0 ) {
        reject(new Error("Command exit with result " + code));
      }else {
        debug("Done running %s", cmd);
        resolve();
      }
    });
    command.on("error", reject);
  });
}

co(function* () {
  var remote = new SSHane({host: "imac", username: "axelhzf"});
  yield exec("rm -rf out");
  yield exec("mkdir -p out");
  yield exec("cp -RL app node_modules package.json out");
  yield spawn("cd out && tar -cvzf ../pirateship.tar.gz .");
  yield exec("rm -rf out");
  yield remote.connect();
  yield remote.exec("forever stop app/server/server.js");
  yield remote.exec("rm -rf dev/pirateship");
  yield remote.exec("mkdir -p dev/pirateship");
  yield remote.put("pirateship.tar.gz", "dev/pirateship/pirateship.tar.gz");
  yield remote.exec("cd dev/pirateship");
  yield remote.exec("tar -xvzf pirateship.tar.gz");
  yield remote.exec("rm pirateship.tar.gz");
  yield remote.exec('NODE_CONFIG_DIR=./app/server/config forever start -c "node --harmony" app/server/server.js');
  yield remote.close();
}).catch(function (e) {
  console.log(e.stack);
  console.log(e);
});