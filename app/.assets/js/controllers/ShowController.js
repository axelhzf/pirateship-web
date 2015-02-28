"use strict";

var ShowController = (function () {
  var ShowController = function ShowController(showsStore, $stateParams, torrentsStore, fileStore, player, subtitlesStore, $http) {
    this.showsStore = showsStore;
    this.$stateParams = $stateParams;
    this.torrentsStore = torrentsStore;
    this.fileStore = fileStore;
    this.player = player;
    this.subtitlesStore = subtitlesStore;
    this.$http = $http;

    this.fetchShow();
  };

  ShowController.prototype.fetchShow = function () {
    var _this = this;


    var url = "/api/shows/" + this.$stateParams.imdb;
    this.$http({ method: "get", url: url }).then(function (response) {
      _this.show = response.data;
      _this.seasons = _.sortBy(_.pluck(_this.show.seasons, "number"));
      _this.episodesBySeason = _.reduce(_this.show.seasons, function (memo, season) {
        memo[season.number] = season.episodes;
        return memo;
      }, []);
      _this.setActiveSeason(_.last(_this.seasons));
    });
  };

  ShowController.prototype.setActiveSeason = function (activeSeason) {
    this.activeSeason = activeSeason;
    this.activeEpisodes = this.episodesBySeason[this.activeSeason];

    this.updateActiveEpisodesFile();
  };

  ShowController.prototype.pad = function (number) {
    return s.pad(number, 2, "0");
  };

  ShowController.prototype.download = function (episode) {
    var _this2 = this;
    var query = this.episodeId(episode) + " 720p";
    this.torrentsStore.find({ query: query }).then(function (torrents) {
      _this2.torrentsStore.download(torrents[0].link).then(function () {
        console.log("downloading");
      });
    });
  };

  ShowController.prototype.episodeId = function (episode) {
    var show = this.show.title;
    var season = episode.season;
    var number = episode.number;
    var episodeId = show + " S" + this.pad(season) + "E" + this.pad(number);
    return episodeId;
  };

  ShowController.prototype.updateActiveEpisodesFile = function () {
    var _this3 = this;
    this.activeEpisodes.forEach(function (episode) {
      var episodeId = _this3.episodeId(episode);
      _this3.fileStore.find({ query: episodeId }).then(function (file) {
        episode.local = file;
      });
    });
  };

  ShowController.prototype.play = function (episode) {
    this.player.playTv(episode.local.video);
  };

  ShowController.prototype.episodeIsAvailableToDownload = function (episode) {
    var episodeTime = new Date(episode.first_aired).getTime();
    if (episodeTime === 0) return false;
    return episodeTime < Date.now();
  };

  ShowController.prototype.subtitlesState = function (episode) {
    var langs = _.keys(episode.local.subtitles);
    if (langs.length >= 2) {
      return "subtitles-completed";
    } else if (langs.length > 0) {
      return "subtitles-partial";
    }
  };

  ShowController.prototype.downloadSubtitles = function (episode) {
    var _this4 = this;
    if (episode.local.video) {
      this.subtitlesStore.download(episode.local.video).then(function () {
        _this4.updateActiveEpisodesFile();
      });
    }
  };

  return ShowController;
})();

angular.module("app").controller("ShowController", ShowController);