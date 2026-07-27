const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const orderFilePath = path.join(__dirname, "../data/orders.json");
const cartFilePath = path.join(__dirname, "../data/cart.json");

//
// GET ALL ORDERS
//
router.get("/all", (req, res) => {
  const orders = JSON.parse(fs.readFileSync(orderFilePath, "utf8"));

  res.status(200).json(orders);
});

//
// PLACE ORDER
//
router.post("/add", (req, res) => {
  const { address } = req.body;

  const orders = JSON.parse(fs.readFileSync(orderFilePath, "utf8"));
  const cart = JSON.parse(fs.readFileSync(cartFilePath, "utf8"));

  if (!cart.data || cart.data.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty"
    });
  }

  let actualPrice = 0;
  let discountedPrice = 0;

  cart.data.forEach((item) => {
    actualPrice +=
      Number(item.cartItem.actualPrice) * item.itemQuantity;

    discountedPrice +=
      Number(item.cartItem.discountPrice) * item.itemQuantity;
  });

  const order = {
    "user": { 'userEmail'},
    "orderAddress",
    "orderItems"} = req.body;

  orders.data.push(order);

  fs.writeFileSync(
    orderFilePath,
    JSON.stringify(orders, null, 2)
  );

  // Empty cart after successful order
  cart.data = [];

  fs.writeFileSync(
    cartFilePath,
    JSON.stringify(cart, null, 2)
  );

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order
  });
});

module.exports = router;