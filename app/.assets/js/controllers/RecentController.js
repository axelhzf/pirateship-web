"use strict";

var RecentController = (function () {
  var RecentController = function RecentController(recentStore, fileStore) {
    this.recentStore = recentStore;
    this.fileStore = fileStore;
    this.fetch();

    this.display = window.localStorage.recentDisplay || "group"; //list or group
  };

  RecentController.prototype.setDisplay = function (newDisplay) {
    this.display = window.localStorage.recentDisplay = newDisplay;
  };

  RecentController.prototype.fetch = function () {
    var _this = this;
    this.recentStore.find({ limit: 100, order: "createdAt DESC" }).then(function (response) {
      _this.recent = response.items;

      var showsById = {};
      _this.shows = [];

      _this.recent.forEach(function (recent) {
        _this.fileStore.find({ query: recent.file }).then(function (file) {
          _.extend(recent, file);
          if (recent.show) {
            var showId = recent.show.id;
            if (!showsById[showId]) {
              var show = _.omit(recent.show, "episode");
              show.episodes = [];
              showsById[showId] = show;
              _this.shows.push(show);
            }
            showsById[showId].episodes.push(recent.show.episode);
          }
        });
      });
    });
  };

  return RecentController;
})();

angular.module("app").controller("RecentController", RecentController);