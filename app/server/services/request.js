var request = require("co-request");

exports.get = function* (url) {
  var res = yield request.get({url: url, json: true});
  if (res.statusCode !== 200) {
    throw new Error("Response not ok [" + url + "]", res);
  }
  return res.body;
};