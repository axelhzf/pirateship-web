class TorrentsController {
  constructor(global) {
    this.global = global;
  }

  search () {
    this.searchQuery = this.tmpSearchQuery;
  }

}

angular.module("app").controller("TorrentsController", TorrentsController);
