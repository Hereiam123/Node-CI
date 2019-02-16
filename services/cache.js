const mongoose = require("mongoose");
const exec = mongoose.Query.prototype.exec;
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

mongoose.Query.prototype.exec = async function() {
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );
  console.log(key);
  //Check if we have value for the key in redis
  const cacheValue = await client.get(key);

  if (cacheValue) {
    console.log(cacheValue);
  }

  //Get mongo db call and apply to redis
  const result = await exec.apply(this, arguments);
  console.log(result);
};
