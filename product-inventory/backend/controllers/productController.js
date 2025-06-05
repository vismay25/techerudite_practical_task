const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, quantity, categories } = req.body;
    if (
      !name ||
      !quantity ||
      !Array.isArray(categories) ||
      categories.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Product.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Product name must be unique" });
    }

    const product = new Product({ name, description, quantity, categories });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", categories = [] } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (categories.length > 0) {
      filter.categories = { $in: categories };
    }

    const products = await Product.find(filter)
      .populate("categories")
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
