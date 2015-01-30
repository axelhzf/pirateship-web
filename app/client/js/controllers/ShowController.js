class ShowController {
  constructor(showsStore, $stateParams) {
    this.showsStore = showsStore;
    this.$stateParams = $stateParams;

    console.log(this.$stateParams);

    this.fetchShow();
  }

  fetchShow() {
    this.showsStore.get(this.$stateParams.id).then((show) => {
      this.show = show;
      this.seasons = _.unique(_.pluck(this.show.episodes, "season")).sort();
      this.episodesBySeason = _.groupBy(_.sortBy(this.show.episodes, "number"), "season");
      this.setActiveSeason(_.last(this.seasons));
    });
  }

  setActiveSeason(activeSeason) {
    this.activeSeason = activeSeason;
    this.activeEpisodes = this.episodesBySeason[this.activeSeason];
  }

  pad (number) {
    return s.pad(number, 2, "0");
  }
  
}

angular.module("app").controller("ShowController", ShowController);