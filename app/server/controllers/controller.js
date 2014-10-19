var scripts = require("../../client/js/scripts.json");
exports.render = function (templateName) {
  return function* () {
    yield this.render(templateName, {scripts: scripts});
  }
};