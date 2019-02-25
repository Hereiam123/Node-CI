jest.setTimeout(30000);

require("../models/User");
const mongoose = require("mongoose");
const keys = require("../config/keys");

//Use node.js global promise
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
