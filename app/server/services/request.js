var logger = require("barbakoa").logger.child({component: "request"});
var request = require("co-request");

exports.get = function* (url) {
  var remaining_tries = 3;
  while (remaining_tries > 0) {
    try {
      var res = yield request.get({url: url, json: true});
      if (res.statusCode === 200) {
        return res.body;
      }
      logger.warn("statusCode !== 200", {statusCode: res.statusCode});
    } catch (e) {
      remaining_tries--;
      logger.warn("error", {url: url}, e);
    }
  }
  throw new Error("Response not ok [" + url + "]");
};