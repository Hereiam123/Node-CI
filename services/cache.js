const mongoose = require("mongoose");
const exec = mongoose.Query.prototype.exec;
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function(options = {}) {
  this._cache = true;
  this._hashKey = JSON.stringify(options.key || "");
  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this._cache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  //Check if we have value for the key in redis
  const cacheValue = await client.hget(this._hashKey, key);

  if (cacheValue) {
    console.log("Pulling from cache");
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  //Get mongo db call and apply to redis
  const result = await exec.apply(this, arguments);

  client.hset(this._hashKey, key, JSON.stringify(result), "EX", 10);
  return result;
};
