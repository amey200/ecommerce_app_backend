const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");
const db = require("../firebase");
const products = require("../data/products.json");

const router = express.Router();

const calculateTotal = (items) =>
  items.reduce(
    (total, item) =>
      total + Number(item.cartItem.discountPrice) * item.itemQuantity,
    0
  );

// GET ALL CART PRODUCTS FOR ONE USER
router.get("/all", async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const cartDoc = await db.collection("carts").doc(userEmail).get();
    const items = cartDoc.exists ? cartDoc.data().items || [] : [];

    res.status(200).json({
      success: true,
      message: "Cart products fetched successfully",
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const itemId = req.body.cartItem?.itemId;
    const userEmail = req.body.user?.userEmail;

    if (!itemId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Product and user email are required",
      });
    }

    const product = products.data.find((item) => item.itemId == itemId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const cartRef = db.collection("carts").doc(userEmail);
    let savedCartItem;
    let message;

    await db.runTransaction(async (transaction) => {
      const cartDoc = await transaction.get(cartRef);
      const items = cartDoc.exists ? cartDoc.data().items || [] : [];
      const existingCart = items.find(
        (item) => item.cartItem.itemId == itemId
      );

      if (existingCart) {
        existingCart.itemQuantity += 1;
        savedCartItem = existingCart;
        message = "Cart quantity updated successfully";
      } else {
        savedCartItem = {
          cartId: Date.now(),
          user: { userEmail },
          cartItem: product,
          itemQuantity: 1,
        };
        items.push(savedCartItem);
        message = "Product added successfully";
      }

      transaction.set(
        cartRef,
        {
          userEmail,
          items,
          totalAmount: calculateTotal(items),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });

    res.status(200).json({ success: true, message, data: savedCartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CHANGE CART QUANTITY
router.put("/add/quantity", async (req, res) => {
  try {
    const cartId = Number(req.query.cartId);
    const quantity = Number(req.query.quantity);

    if (!Number.isInteger(cartId) || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid cartId and quantity are required",
      });
    }

    // The existing Flutter API sends only cartId, so locate its user cart first.
    const cartsSnapshot = await db.collection("carts").get();
    const cartDoc = cartsSnapshot.docs.find((doc) =>
      (doc.data().items || []).some((item) => item.cartId === cartId)
    );

    if (!cartDoc) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const cartRef = cartDoc.ref;
    let updatedCartItem;

    await db.runTransaction(async (transaction) => {
      const latestCart = await transaction.get(cartRef);
      const items = latestCart.data().items || [];
      const itemIndex = items.findIndex((item) => item.cartId === cartId);

      if (itemIndex === -1) {
        throw new Error("Cart item not found");
      }

      if (quantity === 0) {
        items.splice(itemIndex, 1);
      } else {
        items[itemIndex].itemQuantity = quantity;
        updatedCartItem = items[itemIndex];
      }

      transaction.update(cartRef, {
        items,
        totalAmount: calculateTotal(items),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    res.status(200).json({
      success: true,
      message:
        quantity === 0
          ? "Cart item removed successfully"
          : "Cart quantity updated successfully",
      ...(updatedCartItem ? { data: updatedCartItem } : {}),
    });
  } catch (error) {
    const statusCode = error.message === "Cart item not found" ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
});

module.exports = router;
