const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products"
    });
  });
};

exports.getProductById = (req, res, next) => {
  const prodId = req.params.id;
  Product.findById(prodId, product => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products"
    });
  });
};

exports.getIndex = (req, res) => {
  Product.fetchAll(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/"
    });
  });
};

exports.getCart = (req, res) => {
  Cart.getProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts
      });
    });
  });
};

exports.addToCart = (req, res) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
};

exports.deleteFromCart = (req, res) => { 
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.delete(prodId, product.price);
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
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders"
  });
};
