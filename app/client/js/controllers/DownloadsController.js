class DownloadsController {

  constructor(downloadsStore, $interval, $scope) {
    this.$interval = $interval;
    this.downloadsStore = downloadsStore;

    $scope.$on("$destroy", () => {
      this.stopInterval()
    });

    this.startInterval();
  }

  destroy() {
    this.stopInterval();
  }

  startInterval() {
    this.interval = this.$interval(() => {
      this.fetchDownloads();
    }, 1000);
  }

  stopInterval() {
    if (this.interval) {
      console.log("clearing interval");
      clearInterval(this.interval);
    }
  }

  fetchDownloads() {
    this.downloadsStore.find().then((downloads) => {
      this.downloads = downloads;
    });
  }

}

angular.module("app").controller("DownloadsController", DownloadsController);