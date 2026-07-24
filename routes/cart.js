
const express = require("express");
const router = express.Router();

const cart = require("../data/cart.json");
const products = require("../data/products.json");

//
// Get All Cart Products
//
router.get("/all", (req, res) => {
  res.status(200).json(cart);
});

//
// Add To Cart
//
router.post("/add", (req, res) => {
  const itemId = req.body.cartItem?.itemId;

  const product = products.data.find(
    (item) => item.itemId == itemId
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  const existingCart = cart.data.find(
    (item) => item.cartItem.itemId == itemId
  );

  if (existingCart) {
    existingCart.itemQuantity += 1;

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: existingCart
    });
  }

  const newCartItem = {
    cartId: cart.data.length + 1,
    cartItem: product,
    itemQuantity: 1
  };

  cart.data.push(newCartItem);

  res.status(200).json({
    success: true,
    message: "Product added successfully",
    data: newCartItem
  });
});

//
// Increase quantity
//
router.put("/increase/:cartId", (req, res) => {
  const cartId = parseInt(req.params.cartId);

  const cartItem = cart.data.find(
    (item) => item.cartId === cartId
  );

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found"
    });
  }

  cartItem.itemQuantity++;

  res.status(200).json({
    success: true,
    message: "Quantity increased",
    data: cartItem
  });
});

// decrese quantity

router.put("/decrease/:cartId", (req, res) => {
  const cartId = parseInt(req.params.cartId);

  const cartItem = cart.data.find(
    (item) => item.cartId === cartId
  );

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found"
    });
  }

  if (cartItem.itemQuantity > 1) {
    cartItem.itemQuantity--;
  } else {
    const index = cart.data.findIndex(
      (item) => item.cartId === cartId
    );
    cart.data.splice(index, 1);
  }

  res.status(200).json({
    success: true,
    message: "Quantity decreased",
    data: cartItem
  });
});

//
// Remove Cart Item
//
router.delete("/remove/:cartId", (req, res) => {
  const cartId = parseInt(req.params.cartId);

  const index = cart.data.findIndex(
    (item) => item.cartId === cartId
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found"
    });
  }

  cart.data.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Cart item removed successfully"
  });
});

module.exports = router;