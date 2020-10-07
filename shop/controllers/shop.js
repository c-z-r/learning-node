const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProductById = (req, res, next) => {
  const prodId = req.params.id;
  console.log("productIddd: " + prodId);
  Product.findById(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res) => {
  return req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: user.cart.items
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.addToCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    req.user.addToCart(product);
    res.redirect("/cart");
  });
};

exports.deleteFromCart = (req, res) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(result => {
    res.redirect("/cart");
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout"
  });
};

exports.getOrders = (req, res) => {
  Order.find({ "user.userId": req.user._id }).then(orders => {
    console.log("userId " + orders);
    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orders
    });
  });
};

exports.postOrder = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          qty: i.qty,
          product: { ...i.productId._doc }
        };
      });
      const order = new Order({
        products: products,
        user: {
          username: user.username,
          userId: user
        }
      });

      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      console.log(err);
    });
};
