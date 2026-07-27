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
  const { userEmail } = req.query;

  const orders = JSON.parse(fs.readFileSync(orderFilePath, "utf8"));

  const userOrders = orders.data.filter(
    (order) => order.user.userEmail === userEmail
  );

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: userOrders,
  });
});

//
// PLACE ORDER
//
router.post("/add", (req, res) => {
  const { userEmail, addressId } = req.body;

  const orders = JSON.parse(fs.readFileSync(orderFilePath, "utf8"));
  const cart = JSON.parse(fs.readFileSync(cartFilePath, "utf8"));

  if (!cart.data || cart.data.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty"
    });
  }

  const userCart = cart.data.filter(
    (item) => item.user.userEmail === userEmail
  );

  let actualPrice = 0;
  let discountedPrice = 0;

  userCart.forEach((item) => {
    actualPrice += Number(item.cartItem.actualPrice) * item.itemQuantity;
    discountedPrice += Number(item.cartItem.discountPrice) * item.itemQuantity;
  });

  const order = {
    orderId: orders.data.length + 1,
    user: {
      userEmail
    },
    addressId,
    orderItems: userCart,
    actualPrice,
    discountedPrice,
    totalAmount: discountedPrice,
    orderDate: new Date().toISOString(),
    orderStatus: "Pending"
  };

  orders.data.push(order);

  fs.writeFileSync(
    orderFilePath,
    JSON.stringify(orders, null, 2)
  );

  // Remove only this user's cart
  cart.data = cart.data.filter(
    (item) => item.user.userEmail !== userEmail
  );

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