var config = require("config");
var glob = require("co-glob");
var util = require("util");
var _ = require("underscore");
var _s = require("underscore.string");
var path = require("path");

exports.find = function* find(file) {
  console.log("query", file);
  var destinationFolder = config.get("postProcess.destinationFolder");
  var normalizedFile = normalizeTvShowFile(file);

  var showDirectory = path.join(destinationFolder, "tvshows", normalizedFile.show);
  var video = yield globFirstFile(showDirectory, util.format("*%s*.+(mkv|mp4|avi)", normalizedFile.episodeId));
  var spaSrt = yield globFirstFile(showDirectory, util.format("*%s*.spa.srt", normalizedFile.episodeId));
  var engSrt = yield globFirstFile(showDirectory, util.format("*%s*.eng.srt", normalizedFile.episodeId));

  return {
    video: video,
    subtitles: {
      spa: spaSrt,
      eng: engSrt
    }
  };
};

function* globFirstFile(directory, pattern) {
  var result = yield glob(pattern, {cwd: directory, nocase: true});
  if (result) {
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
