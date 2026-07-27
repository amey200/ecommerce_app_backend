const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const wishlistFilePath = path.join(__dirname, "../data/wishlist.json");
const productFilePath = path.join(__dirname, "../data/products.json");

//
// Get Wishlist
//
router.get("/all", (req, res) => {
  const { userEmail } = req.query;

  const wishlist = JSON.parse(fs.readFileSync(wishlistFilePath, "utf8"));

  const userWishlist = wishlist.data.filter(
    (item) => item.user.userEmail === userEmail
  );

  res.status(200).json({
    success: true,
    message: "Wishlist fetched successfully",
    data: userWishlist
  });
});

//
// Add To Wishlist
//
router.post("/add", (req, res) => {
  const { item, user } = req.body;

  const itemId = item?.itemId;
  const userEmail = user?.userEmail;

  if (!itemId || !userEmail) {
    return res.status(400).json({
      success: false,
      message: "ItemId and UserEmail are required"
    });
  }

  const wishlist = JSON.parse(fs.readFileSync(wishlistFilePath, "utf8"));
  const products = JSON.parse(fs.readFileSync(productFilePath, "utf8"));

  const product = products.data.find(
    (p) => p.itemId == itemId
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  const alreadyAdded = wishlist.data.find(
    (w) =>
      w.user.userEmail === userEmail &&
      w.wishListItem.itemId == itemId
  );

  if (alreadyAdded) {
    return res.status(200).json({
      success: true,
      message: "Already in wishlist"
    });
  }

  const newWishListItem = {
    wishListId: wishlist.data.length + 1,

    user: {
      userEmail
    },

    wishListItem: {
      itemId: product.itemId,
      itemName: product.itemName,
      itemDescription: product.itemDescription,
      itemImage: product.itemImage,
      actualPrice: product.actualPrice,
      discountPrice: product.discountPrice,
      category: product.category,
      fav: 1,
      itemDetails: product.itemDetails
    }
  };

  wishlist.data.push(newWishListItem);

  fs.writeFileSync(
    wishlistFilePath,
    JSON.stringify(wishlist, null, 2)
  );

  res.status(200).json({
    success: true,
    message: "Added to wishlist successfully",
    data: newWishListItem
  });
});

//
// Remove Wishlist Item
//
router.delete("/remove/item/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const userEmail = req.query.userEmail;

  const wishlist = JSON.parse(fs.readFileSync(wishlistFilePath, "utf8"));

  const index = wishlist.data.findIndex(
    (item) =>
      item.wishListItem.itemId === itemId &&
      item.user.userEmail === userEmail
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Wishlist item not found"
    });
  }

  wishlist.data.splice(index, 1);

  fs.writeFileSync(
    wishlistFilePath,
    JSON.stringify(wishlist, null, 2)
  );

  res.status(200).json({
    success: true,
    message: "Removed from wishlist successfully"
  });
});

module.exports = router;