const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const url =
  "mongodb+srv://czr:IdRJowB9N0pVEAO8@cluster0.lolcv.mongodb.net/udemy?retryWrites=true&w=majority";

let _db;

const mongoConnect = callback => {
  MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
      console.log("Connected to mongodb!");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
