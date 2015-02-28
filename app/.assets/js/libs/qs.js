"use strict";

(function () {
  // Load modules


  // Declare internals

  var internals = {
    delimiter: "&",
    indices: true
  };

  var utils = {};

  utils.arrayToObject = function (source) {
    var obj = {};
    for (var i = 0, il = source.length; i < il; ++i) {
      if (typeof source[i] !== "undefined") {
        obj[i] = source[i];
      }
    }

    return obj;
  };


  utils.merge = function (target, source) {
    if (!source) {
      return target;
    }

    if (typeof source !== "object") {
      if (Array.isArray(target)) {
        target.push(source);
      } else {
        target[source] = true;
      }

      return target;
    }

    if (typeof target !== "object") {
      target = [target].concat(source);
      return target;
    }

    if (Array.isArray(target) && !Array.isArray(source)) {
      target = exports.arrayToObject(target);
    }

    var keys = Object.keys(source);
    for (var k = 0, kl = keys.length; k < kl; ++k) {
      var key = keys[k];
      var value = source[key];

      if (!target[key]) {
        target[key] = value;
      } else {
        target[key] = exports.merge(target[key], value);
      }
    }

    return target;
  };


  utils.decode = function (str) {
    try {
      return decodeURIComponent(str.replace(/\+/g, " "));
    } catch (e) {
      return str;
    }
  };


  utils.compact = function (obj, refs) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    refs = refs || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
      return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
      var compacted = [];

      for (var i = 0, l = obj.length; i < l; ++i) {
        if (typeof obj[i] !== "undefined") {
          compacted.push(obj[i]);
        }
      }

      return compacted;
    }

    var keys = Object.keys(obj);
    for (var i = 0, il = keys.length; i < il; ++i) {
      var key = keys[i];
      obj[key] = utils.compact(obj[key], refs);
    }

    return obj;
  };


  utils.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === "[object RegExp]";
  };


  utils.isBuffer = function (obj) {
    if (obj === null || typeof obj === "undefined") {
      return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  };


  internals.stringify = function (obj, prefix, options) {
    if (utils.isBuffer(obj)) {
      obj = obj.toString();
    } else if (obj instanceof Date) {
      obj = obj.toISOString();
    } else if (obj === null) {
      obj = "";
    }

    if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
      return [encodeURIComponent(prefix) + "=" + encodeURIComponent(obj)];
    }

    var values = [];

    if (typeof obj === "undefined") {
      return values;
    }

    var objKeys = Object.keys(obj);
    for (var i = 0, il = objKeys.length; i < il; ++i) {
      var key = objKeys[i];
      if (!options.indices && Array.isArray(obj)) {
        values = values.concat(internals.stringify(obj[key], prefix, options));
      } else {
        values = values.concat(internals.stringify(obj[key], prefix + "[" + key + "]", options));
      }
    }

    return values;
  };

  function stringify(obj, options) {
    options = options || {};
    var delimiter = typeof options.delimiter === "undefined" ? internals.delimiter : options.delimiter;
    options.indices = typeof options.indices === "boolean" ? options.indices : internals.indices;

    var keys = [];

    if (typeof obj !== "object" || obj === null) {
      return "";
    }

    var objKeys = Object.keys(obj);
    for (var i = 0, il = objKeys.length; i < il; ++i) {
      var key = objKeys[i];
      keys = keys.concat(internals.stringify(obj[key], key, options));
    }

    return keys.join(delimiter);
  }

  window.qs = {
    stringify: stringify
  };
})();