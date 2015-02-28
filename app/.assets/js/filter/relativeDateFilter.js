"use strict";

/**
 * Constants.
 */

var second = 1000;
var minute = 60 * second;
var hour = 60 * minute;
var day = 24 * hour;
var week = 7 * day;
var year = day * 365;
var month = year / 12;

/**
 * Return `date` in words relative to `other`
 * which defaults to now.
 *
 * @param {Date} date
 * @param {Date} other
 * @return {String}
 * @api public
 */

function relative(date, other) {
  other = other || new Date();
  var suffix = other - date > 0 ? " ago" : "";
  var ms = Math.abs(other - date);

  if (ms < second) return "";

  if (ms == second) return "one second" + suffix;
  if (ms < minute) return Math.ceil(ms / second) + " seconds" + suffix;

  if (ms == minute) return "one minute" + suffix;
  if (ms < hour) return Math.ceil(ms / minute) + " minutes" + suffix;

  if (ms == hour) return "one hour" + suffix;
  if (ms < day) return Math.ceil(ms / hour) + " hours" + suffix;

  if (ms == day) return "one day" + suffix;
  if (ms < week) return Math.ceil(ms / day) + " days" + suffix;

  if (ms == week) return "one week" + suffix;
  if (ms < month) return Math.ceil(ms / week) + " weeks" + suffix;

  if (ms == month) return "one month" + suffix;
  if (ms < year) return Math.ceil(ms / month) + " months" + suffix;

  if (ms == year) return "one year" + suffix;
  return Math.round(ms / year) + " years" + suffix;
}

angular.module("app").filter("relativeDate", function () {
  return function (date) {
    return relative(new Date(date));
  };
});