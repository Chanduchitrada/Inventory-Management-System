const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/inventory");

const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  quantity: Number,
  sales: { type: Number, default: 0 }
});

// Add product
app.post("/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// View and search products
app.get("/products", async (req, res) => {
  const products = await Product.find({
    name: { $regex: req.query.search || "", $options: "i" }
  });
  res.json(products);
});

// Update product
app.put("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id, req.body, { new: true }
  );
  res.json(product);
});

// Stock in / Stock out
app.put("/stock/:id", async (req, res) => {
  const { type, quantity } = req.body;
  const p = await Product.findById(req.params.id);

  if (!p || quantity <= 0)
    return res.status(400).json({ message: "Invalid request" });

  if (type === "in") p.quantity += quantity;
  else if (type === "out" && p.quantity >= quantity) {
    p.quantity -= quantity;
    p.sales += quantity * p.price;
  } else {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  await p.save();
  res.json(p);
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

// Sales report
app.get("/report", async (req, res) => {
  const result = await Product.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$sales" } } }
  ]);
  res.json({ totalSales: result[0]?.totalSales || 0 });
});

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
