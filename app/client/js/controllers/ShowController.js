class ShowController {
  constructor(showsStore, $stateParams, torrentsStore) {
    this.showsStore = showsStore;
    this.$stateParams = $stateParams;
    this.torrentsStore = torrentsStore;

    console.log(this.$stateParams);

    this.fetchShow();
  }

  fetchShow() {
    this.showsStore.get(this.$stateParams.id).then((show) => {
      this.show = show;
      this.seasons = _.sortBy(_.unique(_.pluck(this.show.episodes, "season")));
      this.episodesBySeason = _.groupBy(_.sortBy(this.show.episodes, "number"), "season");
      this.setActiveSeason(_.last(this.seasons));
    });
  }

  setActiveSeason(activeSeason) {
    this.activeSeason = activeSeason;
    this.activeEpisodes = this.episodesBySeason[this.activeSeason];
  }

  pad(number) {
    return s.pad(number, 2, "0");
  }

  download(episode) {
    var show = this.show.title;
    var season = episode.season;
    var number = episode.number;
    var query = show + " S" + this.pad(season) + "E" + this.pad(number) + " 720p";

    this.torrentsStore.find({query: query}).then((torrents) => {
      console.log(torrents);
      this.torrentsStore.download(torrents[0].link).then(() => {
        console.log("downloading");
      });
    });

  }

}

angular.module("app").controller("ShowController", ShowController);