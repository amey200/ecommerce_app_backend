const express = require("express");
const cors = require("cors");

const bannerRoutes = require("./routes/banner");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const wishlistRoutes = require("./routes/wishlist");
const cartRoutes = require("./routes/cart");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
const recommendedRoutes = require("./routes/recommended");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/ecom/banner", bannerRoutes);
app.use("/ecom/category", categoryRoutes);
app.use("/item", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/ecom/user", addressRoutes);
app.use("/order", orderRoutes);
app.use("/ecom/user", userRoutes);
app.use("/item", recommendedRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce Backend Running Successfully 🚀"
  });
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running : http://localhost:${PORT}`);
});