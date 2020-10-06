const mongoDb = require("mongodb");
const ObjectId = mongoDb.ObjectId;
const getDb = require("../util/database").getDb;

module.exports = class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const index = this.cart.items.findIndex(elem => {
      return elem.productId.toString() === product._id.toString();
    });

    const updatedCartItems = [...this.cart.items];
    if (index >= 0) {
      ++updatedCartItems[index].qty;
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), qty: 1 });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const ids = this.cart.items.map(item => {
      return item.productId;
    });
    console.log("products: ", ids.toString());
    return getDb()
      .collection("products")
      .find({ _id: { $in: ids } })
      .toArray()
      .then(products => {
        console.log("products2: ", products.toString());
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(elem => {
              return elem.productId.toString() === p._id.toString();
            }).qty
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      item => item.productId.toString() !== productId
    );

    return getDb()
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.username,
            email: this.email
          }
        };
        return getDb()
          .collection("orders")
          .insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return getDb()
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    return getDb()
      .collection("orders")
      .find({
        "user._id": new Object(this._id)
      })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .next()
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
