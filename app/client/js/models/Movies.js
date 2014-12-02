class MoviesStoreQuery {
  constructor() {
    this.limit = 10;
    this.query = null;
    this.year = null;
    this.genre = null;
    this.sort = null;
  }
}

class MoviesStore {

  constructor(config, $http) {
    this.config = config;
    this.$http = $http;
  }

  getMoviesIterator(moviesStoreQuery) {
    var page = new MoviesIterator(this.$http, this.config.api.path + "/movies");
    page.params = this.buildFindParams(moviesStoreQuery);
    page.params.limit = 20;
    return page;
  }

  buildFindParams(moviesStoreQuery) {
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

    if (this.sort) {
      order = "rating DESC";
    }

    return {
      where: parameters,
      order: order
    }
  }

}

class MoviesIterator {
  constructor($http, url) {
    this.$http = $http;
    this.url = url;
    this.params = {};

    this.items = [];
    this.offset = 0;

    this.requestQueue = new PromiseQueue(); //need a queue to append pages in order
  }

  appendNextPage() {
    this.requestQueue.add(() => {
      var params = _.extend({offset: this.offset}, this.params);
      var paramsString = qs.stringify(params);
      var url = this.url + "?" + paramsString;
      return this.$http.get(url).then((response) => {
        var data = response.data;
        this.offset = data.offset + data.limit;
        Array.prototype.push.apply(this.items, data.items);
        return this;
      });
    });
  }
}

class PromiseQueue {
  constructor() {
    this.queue = [];
    this.activePromise = null;
  }

  add(fn) {
    if (!this.activePromise) {
      this._executeFn(fn);
    } else {
      this.queue.push(fn);
    }
  }

  _executeFn(fn) {
    this.activePromise = fn();
    this.activePromise.then((response) => {
      this.activePromise = null;
      if (this.queue.length > 0) {
        var nextFn = this.queue.splice(0, 1)[0];
        setTimeout(() => {
          this._executeFn(nextFn);
        }, 0);
      }
      return response;
    });
  }

}

angular.module("app").service("moviesStore", MoviesStore);