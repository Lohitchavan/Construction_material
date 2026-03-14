const Product = require("../models/Product");

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

async function listProducts(req, res, next) {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      rating,
      sort = "new",
      page = "1",
      limit = "12",
    } = req.query;

    const filter = {};

    if (q && String(q).trim()) {
      filter.$text = { $search: String(q).trim() };
    }
    if (category && String(category).trim()) {
      filter.category = String(category).trim();
    }

    const min = toNumber(minPrice);
    const max = toNumber(maxPrice);
    if (min !== null || max !== null) {
      filter.price = {};
      if (min !== null) filter.price.$gte = min;
      if (max !== null) filter.price.$lte = max;
    }

    const minRating = toNumber(rating);
    if (minRating !== null) filter.rating = { $gte: minRating };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const sortMap = {
      new: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      name_asc: { name: 1 },
    };

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortMap[sort] || sortMap.new).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const payload = req.body || {};
    const created = await Product.create(payload);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

