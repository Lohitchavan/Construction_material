const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.body;
  try {
    const product = new Product({
      supplierId: req.user.id,
      name,
      description,
      price,
      stock,
      imageUrl
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ supplierId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndUpdate(
      { _id: id, supplierId: req.user.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({ _id: id, supplierId: req.user.id });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
