const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");
const db = require("../firebase");

const router = express.Router();

// GET ALL ORDERS FOR ONE USER
router.get("/all", async (req, res) => {
  try {
    const { userEmail } = req.query;
    const ordersSnapshot = await db
      .collection("orders")
      .where("userEmail", "==", userEmail)
      .get();

    const userOrders = ordersSnapshot.docs
      .map((doc) => doc.data())
      .sort((first, second) =>
        String(second.orderDate).localeCompare(String(first.orderDate))
      );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: userOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PLACE ORDER
router.post("/add", async (req, res) => {
  try {
    const { userEmail, addressId } = req.body;

    if (!userEmail || addressId === undefined) {
      return res.status(400).json({
        success: false,
        message: "User email and address are required",
      });
    }

    const cartRef = db.collection("carts").doc(userEmail);
    const cartDoc = await cartRef.get();
    const userCart = cartDoc.exists ? cartDoc.data().items || [] : [];

    if (userCart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let actualPrice = 0;
    let discountedPrice = 0;

    userCart.forEach((item) => {
      actualPrice += Number(item.cartItem.actualPrice) * item.itemQuantity;
      discountedPrice += Number(item.cartItem.discountPrice) * item.itemQuantity;
    });

    const order = {
      orderId: Date.now(),
      user: { userEmail },
      userEmail,
      addressId: Number(addressId),
      orderItems: userCart,
      actualPrice,
      discountedPrice,
      totalAmount: discountedPrice,
      orderDate: new Date().toISOString(),
      orderStatus: "Pending",
    };

    const orderRef = db.collection("orders").doc();
    const batch = db.batch();
    batch.set(orderRef, order);
    batch.set(
      cartRef,
      {
        userEmail,
        items: [],
        totalAmount: 0,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await batch.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
