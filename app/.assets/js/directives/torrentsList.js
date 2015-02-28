"use strict";

var TorrentsList = (function () {
  var TorrentsList = function TorrentsList(scope, element, attrs, torrentsStore, $state) {
    this.scope = scope;
    this.el = element;
    this.attrs = attrs;
    this.torrentsStore = torrentsStore;
    this.$state = $state;

    this.scope.$watch("query", this.changeQuery.bind(this));
    this.torrents = [];

    if (this.scope.query) {
      this.search();
    }
  };

  TorrentsList.prototype.changeQuery = function (newValue, oldValue) {
    if (newValue !== oldValue) {
      this.search();
    }
  };

  TorrentsList.prototype.search = function () {
    var _this = this;
    console.log("search", this.scope.query);
    this.torrentsStore.find({ query: this.scope.query }).then(function (torrents) {
      _this.torrents = torrents;
    });
  };

  TorrentsList.prototype.downloadMagnet = function (magnet) {
    var _this2 = this;
    this.torrentsStore.download(magnet).then(function () {
      _this2.$state.go("downloads");
    });
  };

  return TorrentsList;
})();

App.directive("torrentsList", function (torrentsStore, $state) {
  return {
    restrict: "E",
    scope: {
      query: "="
    },
    templateUrl: "templates/torrentsLists.html",
    link: function (scope, element, attrs) {
      scope.ctrl = new TorrentsList(scope, element, attrs, torrentsStore, $state);
    }
  };
});