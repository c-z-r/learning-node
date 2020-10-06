const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
    .getCart()
    .then(cartProducts => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts
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
  req.user.deleteItemFromCart(prodId).then(result => {
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
  req.user.getOrders().then(orders => {
    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orders
    });
  });
};

exports.postOrder = (req, res) => {
  req.user.addOrder().then(result => {
    res.render("/shop/orders");
  });
};
