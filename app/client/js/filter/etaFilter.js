function etaFilter(seconds) {
  if (seconds > 0) {
    var duration = moment.duration({seconds: seconds});
    return duration.humanize();
  } else {
    return "na";
  }
}

angular.module("app").filter("eta", function () {
  return etaFilter;
});