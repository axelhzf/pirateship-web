"use strict";

var DownloadsController = (function () {
  var DownloadsController = function DownloadsController(downloadsStore, $interval, $scope) {
    var _this = this;
    this.$interval = $interval;
    this.downloadsStore = downloadsStore;

    $scope.$on("$destroy", function () {
      _this.stopInterval();
    });

    this.startInterval();
  };

  DownloadsController.prototype.destroy = function () {
    this.stopInterval();
  };

  DownloadsController.prototype.startInterval = function () {
    var _this2 = this;
    this.fetchDownloads();
    this.interval = this.$interval(function () {
      _this2.fetchDownloads();
    }, 1000);
  };

  DownloadsController.prototype.stopInterval = function () {
    if (this.interval) {
      this.$interval.cancel(this.interval);
    }
  };

  DownloadsController.prototype.fetchDownloads = function () {
    var _this3 = this;
    this.downloadsStore.find().then(function (downloads) {
      _this3.downloads = downloads;
    });
  };

  DownloadsController.prototype.statusText = function (code) {
    var codes = {
      STOPPED: 0, //Torrent is stopped
      CHECK_WAIT: 1, // Queued to check files
      CHECK: 2, // Checking files
      DOWNLOAD_WAIT: 3, // Queued to download
      DOWNLOAD: 4, // Downloading
      SEED_WAIT: 5, // Queued to seed
      SEED: 6, // Seeding
      ISOLATED: 7 // Torrent can't find peers
    };
    return _.invert(codes)[code];
  };

  DownloadsController.prototype.start = function (download) {
    this.downloadsStore.start(download.id);
  };

  DownloadsController.prototype.stop = function (download) {
    this.downloadsStore.stop(download.id);
  };

  return DownloadsController;
})();

angular.module("app").controller("DownloadsController", DownloadsController);