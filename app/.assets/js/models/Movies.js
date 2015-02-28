"use strict";

var MoviesStoreQuery = function MoviesStoreQuery() {
  this.limit = 10;
  this.query = null;
  this.year = null;
  this.genre = null;
  this.sort = null;
};

var MoviesStore = (function () {
  var MoviesStore = function MoviesStore(config, $http) {
    this.config = config;
    this.$http = $http;
  };

  MoviesStore.prototype.getMoviesIterator = function (moviesStoreQuery) {
    var page = new MoviesIterator(this.$http, this.config.api.path + "/movies");
    page.params = this.buildFindParams(moviesStoreQuery);
    page.params.limit = 20;
    return page;
  };

  MoviesStore.prototype.buildFindParams = function (moviesStoreQuery) {
    var where = [];
    var parameters = [];
    var order = [];

    if (moviesStoreQuery.query) {
      where.push("title LIKE ?");
      parameters.push("%" + moviesStoreQuery.query + "%");
    }
    if (moviesStoreQuery.year) {
      where.push("year = ?");
      parameters.push(moviesStoreQuery.year);
    }

    if (moviesStoreQuery.genre) {
      where.push("genre = ?");
      parameters.push(moviesStoreQuery.genre);
    }

    where = where.join(" and ");
    parameters.unshift(where);

    if (moviesStoreQuery.sort) {
      order = "rating DESC";
    }

    var params = {
      where: parameters,
      order: order
    };

    return params;
  };

  MoviesStore.prototype._doGet = function (url) {
    return this.$http.get(url).then(function (response) {
      return response.data;
    });
  };

  MoviesStore.prototype.get = function (id) {
    var url = this.config.api.path + "/movies/" + id;
    return this._doGet(url);
  };

  MoviesStore.prototype.findTorrentsForMovie = function (id) {
    var url = this.config.api.path + "/movies/" + id + "/torrents";
    return this._doGet(url);
  };

  return MoviesStore;
})();

var MoviesIterator = (function () {
  var MoviesIterator = function MoviesIterator($http, url) {
    this.$http = $http;
    this.url = url;
    this.params = {};

    this.items = [];
    this.offset = 0;

    this.requestQueue = new PromiseQueue(); //need a queue to append pages in order
  };

  MoviesIterator.prototype.appendNextPage = function () {
    var _this = this;
    this.requestQueue.add(function () {
      var params = _.extend({ offset: _this.offset }, _this.params);
      var paramsString = qs.stringify(params);
      var url = _this.url + "?" + paramsString;
      return _this.$http.get(url).then(function (response) {
        var data = response.data;
        _this.offset = data.offset + data.limit;
        Array.prototype.push.apply(_this.items, data.items);
        return _this;
      });
    });
  };

  return MoviesIterator;
})();

var PromiseQueue = (function () {
  var PromiseQueue = function PromiseQueue() {
    this.queue = [];
    this.activePromise = null;
  };

  PromiseQueue.prototype.add = function (fn) {
    if (!this.activePromise) {
      this._executeFn(fn);
    } else {
      this.queue.push(fn);
    }
  };

  PromiseQueue.prototype._executeFn = function (fn) {
    var _this2 = this;
    this.activePromise = fn();
    this.activePromise.then(function (response) {
      _this2.activePromise = null;
      if (_this2.queue.length > 0) {
        var nextFn = _this2.queue.splice(0, 1)[0];
        setTimeout(function () {
          _this2._executeFn(nextFn);
        }, 0);
      }
      return response;
    });
  };

  return PromiseQueue;
})();

angular.module("app").service("moviesStore", MoviesStore);