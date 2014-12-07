var glob = require("simple-glob");
var config = require("../config");

exports.render = function (templateName) {
  return function* () {
    var scripts = exports.getScripts(templateName);
    yield this.render(templateName, {scripts: scripts});
  }
};


exports.getScripts = function (moduleName) {
  var scripts = [];
  try {
    var files = require("../../client/js/scripts.json");
    scripts = glob({cwd: "app/client/"}, files);
  } catch (e) {

  }
  return scripts;
};

