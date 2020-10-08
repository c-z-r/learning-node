const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        qty: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const index = this.cart.items.findIndex(elem => {
    return elem.productId.toString() === product._id.toString();
  });

  const updatedCartItems = [...this.cart.items];
  if (index >= 0) {
    ++updatedCartItems[index].qty;
  } else {
    updatedCartItems.push({ productId: product._id, qty: 1 });
  }

  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(
    item => item.productId.toString() !== productId
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
