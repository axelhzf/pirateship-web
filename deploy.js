var Connection = require("ssh2");
var co = require("co");
var Promise = require("bluebird");
var debug = require("debug")("deploy");
var _ = require("underscore");
var fs = require("fs");
var originalExec = require('mz/child_process').exec;
var childProcess = require('child_process');
var SSHane = require("sshane");

function spawn() {
  var args = _.toArray(arguments);
  debug("Running %s", args.join(" "));
  return new Promise(function (resolve, reject) {
    console.log(args);
    var command = childProcess.spawn.apply(null, args);
    command.stdout.on("data", function (data) {
      console.log(data.toString());
    });
    command.stderr.on("data", function (data) {
      console.log(data.toString());
    });

    command.on("close", function (code) {
      if (code !== 0) {
        reject(new Error("Command exit with result " + code));
      } else {
        debug("Done running %s", cmd);
        resolve();
      }
    });
    command.on("error", reject);
  });
}

function exec(cmd) {
  var args = _.toArray(arguments);
  debug("Executing %s", args[0]);
  return originalExec.apply(null, args);
}

co(function* () {
  process.env.DEBUG = "*";
  
  var remote = new SSHane({host: "imac", username: "axelhzf"});

  yield remote.connect();
  yield remote.exec("cd dev/pirateship-web");
  yield remote.exec("pm2 stop server");
  yield remote.exec("git pull --rebase");
  yield remote.exec("npm prune");
  yield remote.exec("npm install --production --no-optional --loglevel info");
  yield remote.exec('NODE_ENV=production NODE_CONFIG_DIR=./app/server/config pm2 start --node-args="--harmony" app/server/server.js');
  
  yield remote.close();
}).catch(function (e) {
  console.log(e.stack);
  console.log(e);
});