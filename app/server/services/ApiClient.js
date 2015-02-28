"use strict";

var _ = require("lodash");
var request = require("co-request");
var Cacheman = require("cacheman");
var Promise = require("bluebird");
var logger = require("barbakoa").logger.child({component: "ApiClient"});
var qs = require("qs");

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
  
  *get(params) {
    var path = params.path;
    var cacheKey = path + "?" + qs.stringify(params.qs);
    
    var options = _.merge(this.options, params.options);
    options.request.method = "get";
    options.request.uri = options.baseUri + path;
    options.request.qs = params.qs;
    
    // find in cache
    if(options.cache) { 
      var body = yield this.cache.getAsync(cacheKey);
      if (body) {
        return body;
      }
    }
    
    // do request with retry
    var remainingTries = options.retry + 1;
    var body;
    while (remainingTries > 0) {
      logger.info("doing request", path);
      var res = yield request(options.request);
      if (res.statusCode === 200) {
        body = res.body;
        break;
      } else {
        remainingTries--;
        logger.warn(`Request error`, {
          method: options.request.method,
          uri: options.request.uri,
          remainingTries,
          statusCode: res.statusCode,
          body: res.body
        });
      }
    }

    if (!body) {
      throw new Error(`Request error [GET] ${options.request.uri}`);
    }
  
    //save to cache
    if (options.cache) {
      yield this.cache.setAsync(cacheKey, body, options.cacheTtl);
    }
    
    return body;
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