class TorrentsController {
  constructor(global, $state) {
    this.global = global;
    this.$state = $state;
    
    this.tmpSearchQuery = this.searchQuery = $state.params.query;
  }

  search() {
    this.$state.go("torrents", {query : this.tmpSearchQuery});
  }

}

angular.module("app").controller("TorrentsController", TorrentsController);
