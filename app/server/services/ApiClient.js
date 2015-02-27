"use strict";

var _ = require("lodash");
var request = require("co-request");
var Cacheman = require("cacheman");
var Promise = require("bluebird");

class ApiClient {

  constructor(options) {
    var defaultOptions = {
      cache: false,
      cacheTtl: "1d",
      retry: 0,
      baseUri: "",
      request: {
        json: true,
        headers: {
          "Content-Type": "application/json"
        }
      }
    };
    this.options = _.merge(defaultOptions, options);
    
    this.cache = new Cacheman(this.options.baseUri, {engine: "redis"});
    this.cache = Promise.promisifyAll(this.cache);
  }
  
  *get(path, _options) {
    var options = _.merge(this.options, _options);
    options.request.method = "get";
    options.request.uri = options.baseUri + path;
    
    console.log(options);
    if(options.cache) { // find path in cache
      var body = yield this.cache.getAsync(path);
      console.log("get cache", path, body !== undefined);
      if (body) {
        console.log("from cache");
        return body;
      }
    }
    
    var response = yield request(options.request);
    
    if (response.statusCode === 200) {
      var body = response.body;
      if (options.cache) {
        yield this.cache.setAsync(path, body, options.cacheTtl);
      }
      return body;
    } else {
      //todo retry
    }
  }
  
  *post(path, body, _options) {
    var options = _.merge(this.options, _options);
    options.request.method = "post";
    options.request.uri = options.baseUri + path;
    options.request.body = body;
    var response = yield request(options.request);
    // todo retry ?
    return response.body;
  }
  
}

module.exports = ApiClient;