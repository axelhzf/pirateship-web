var config = require("config");
var glob = require("co-glob");
var util = require("util");
var _ = require("underscore");
var _s = require("underscore.string");
var path = require("path");

exports.find = function* find(file) {
  var destinationFolder = config.get("postProcess.destinationFolder");
  var normalizedFile = normalizeTvShowFile(file);

  var showDirectory = path.join(destinationFolder, "tvshows", normalizedFile.show);

  var video = yield globFirstFile(showDirectory, util.format("*%s*.+(mkv|mp4|avi)", normalizedFile.episodeId));
  var result = yield findSubtitles(normalizedFile, showDirectory);
  return {
    video: video,
    subtitles: result
  };
};

function* findSubtitles(normalizedFile, showDirectory) {
  var srtPattern = util.format("*%s*.srt", normalizedFile.episodeId);
  var subtitles = yield glob(srtPattern, {cwd: showDirectory, nocase: true});
  var result = {};
  if (subtitles && subtitles.length > 0) {
    subtitles.forEach(function (subtitle) {
      var match = subtitle.match(/\.(\w{2,3})\.srt$/i);
      var lang = match ? match[1] : "default";
      result[lang] = path.join(showDirectory, subtitle);
    });
  }
  return result;
}

function* globFirstFile(directory, pattern) {
  var result = yield glob(pattern, {cwd: directory, nocase: true});
  if (result && result.length > 0) {
    return path.join(directory, result[0]);
  }
}

function normalizeTvShowFile(file) {
  file = file.replace(/\s+/g, ".");
  var searchResult = file.search(/\.S\d\dE\d\d/i);
  var showName = file.substring(0, searchResult);

  showName = showName.split(/\./).map(function (part) {
    return _s.capitalize(part);
  }).join(".");

  var episodeId = file.match(/S\d\dE\d\d/i)[0];

  return {
    show: showName,
    episodeId: episodeId
  }
}
