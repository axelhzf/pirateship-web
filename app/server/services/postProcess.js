var path = require("path");
var fs = require("mz/fs");
var VideoOrganizer = require("video-organizer");
var config = require("config");
var Promise = require("bluebird");
var mkdirp = Promise.promisify(require("mkdirp"));
var log = require("barbakoa").logger.child({component: "video-organizer"});
var subtitlesDownloader = require("subtitles-downloader");
var co = require("co");
var Recent = require("../models/Recent");
var format = require("util").format;
var _ = require("underscore");
var retry = require("bluebird-retry");


module.exports = {
  start: start,
  stop: stop,
  onProcessedFile: onProcessedFile,
  downloadSubtitle: downloadSubtitle
};

var videoOrganizer;

function* start() {
  if (!config.get("postProcess.enable")) {
    log.info("Postprocess not enabled");
    return;
  }

  var basePath = config.get("postProcess.downloadedFolder");
  var destPath = config.get("postProcess.destinationFolder");

  try {
    yield createIfNotExists(basePath);
    yield createIfNotExists(destPath);

    var options = {
      srcPath: basePath,
      destPath: destPath,
      logger: log
    };
    videoOrganizer = new VideoOrganizer(options);

    videoOrganizer.on("processedFile", function (e) {
      var src = e.src;
      var dest = e.dest;
      co(function * () {
        yield onProcessedFile(src, dest);
      }).catch(function (e) {
        log.error(e, "Error processing file subtitles " + e.dest);
      });
    });

    videoOrganizer.start();

  } catch (e) {
    log.error("VideoOrganizer service error", e);
  }
}

function* onProcessedFile(src, dest) {
  log.info("Processed file %s to %s", src, dest);
  yield Recent.create({file: path.basename(dest)});

  var result = yield {
    "spa": downloadSubtitleRetry(dest, "spa"),
    "eng": downloadSubtitleRetry(dest, "eng")
  };
  log.info(result, "Subtitles downloaded");
}

function downloadSubtitleRetry(file, lang) {
  log.debug("Download subtitle retry %s %s", file, lang);
  var retryOptions = config.get("retry");
  var fn = downloadSubtitle.bind(null, file, lang);
  return retry(fn, retryOptions);
}

function downloadSubtitle(file, lang) {
  return co(function* (){ //wrapped to return a promise that works with promise-retry
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


function* createIfNotExists(folder) {
  var exist = yield fs.exists(folder);
  if (!exist) {
    log.debug("Creating not existing folder %s", folder);
    yield mkdirp(folder);
  }
}

function stop() {
  if (videoOrganizer) {
    videoOrganizer.stop();
    videoOrganizer = undefined;
  }
}