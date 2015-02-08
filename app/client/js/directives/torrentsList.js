class TorrentsList {
  constructor(scope, element, attrs, torrentsStore, $state) {
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
  }

  changeQuery(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.search();
    }
  }

  search() {
    console.log("search", this.scope.query);
    this.torrentsStore.find({query: this.scope.query}).then((torrents) => {
      this.torrents = torrents;
    });
  }

  downloadMagnet(magnet) {
    this.torrentsStore.download(magnet).then(() => {
      this.$state.go("downloads");
    });
  }

}

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
  }
});