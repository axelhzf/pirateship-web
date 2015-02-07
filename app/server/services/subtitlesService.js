var co = require("co");
var config = require("config");
var log = require("barbakoa").logger.child({component: "subtitlesService"});
var format = require("util").format;
var _ = require("underscore");
var retry = require("bluebird-retry");
var subtitlesDownloader = require("subtitles-downloader");

exports.downloadSubtitles = function* (file) {
  return yield {
    "spa": downloadSubtitleRetry(file, "spa"),
    "eng": downloadSubtitleRetry(file, "eng")
  };
};

function downloadSubtitleRetry(file, lang) {
  log.debug("Download subtitle retry %s %s", file, lang);
  var retryOptions = config.get("retry");
  var fn = downloadSubtitle.bind(null, file, lang);
  return retry(fn, retryOptions);
}

function downloadSubtitle(file, lang) {
  return co(function* () { //wrapped to return a promise that works with promise-retry
    log.debug("download subtitle %s %s", file, lang);
    var result = yield subtitlesDownloader.downloadSubtitle(file, lang);
    log.debug("download subtitle result %s", result);
    if (_.isUndefined(result)) {
      var msg = util.format("Subtitle for %s in %s not found");
      throw new Error(msg);
    }
    return result;
  });
}