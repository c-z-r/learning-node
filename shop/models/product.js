const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);

// const mongoDb = require("mongodb");
// const ObjectId = mongoDb.ObjectId;
// const getDb = require("../util/database").getDb;

// module.exports = class Product {
//   constructor(title, imageUrl, description, price, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this._id = id;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: new ObjectId(this._id) }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }

//     return dbOp
//       .then(result => {
//         console.log(result);
//         return result;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongoDb.ObjectId(id) })
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static delete(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongoDb.ObjectId(id) })
//       .then(result => {
//         console.log("Delete product with id " + id + ": " + result);
//         return result;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// };
