"use strict";

var notify = require("push-notify");
var Notification = require("../models/Notification");
var log = require("barbakoa").logger.child({component: "notificationService"});

class NotificationService {

  constructor() {
    this.apn = notify.apn({
      key: __dirname + '/key.pem',
      cert: __dirname + '/cert.pem',
      production: false
    });
    this.apn.on('transmitted', function (notification, device) {
      log.info("transmitted", device);
    });

    this.apn.on('transmissionError', function (errorCode, notification, device) {
      log.error("transmission error", errorCode, device);
    });

    this.apn.on("error", function (error) {
      log.error(error, "error");
    });
  }

  *registerDevice(deviceToken) {
    var notification;
    if (deviceToken) {
      notification = yield Notification.find({where: {deviceToken}});
      if (!notification) {
        notification = yield Notification.create({deviceToken});
      }
    }
    return notification;
  }

  *sendToAll(msg) {
    log.info("Send to all %s", msg);
    var notifications = yield Notification.findAll();
    var self = this;
    notifications.forEach(function (notification) {
      self.apn.send({
        token: notification.deviceToken,
        alert: msg
      });
    });
  }

}

module.exports = new NotificationService();