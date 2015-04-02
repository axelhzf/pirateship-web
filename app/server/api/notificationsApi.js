var Notification = require("../models/Notification");
var notificationService = require("../notifications/notificationService");


exports.registerDevice = function* () {
  var deviceToken = this.request.query.deviceToken;
  var notification = yield notificationService.registerDevice(deviceToken);
  this.body = notification.toJSON();
};

exports.testNotification = function* () {
  yield notificationService.sendToAll("Hola mundo!");
  this.body = {};
};