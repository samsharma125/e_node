const Product = require("../models/Product");
const slugifyLib = require("slugify");

const slugify = (name) =>
  slugifyLib(name, { lower: true, strict: true });

exports.list = async (req, res, next) => {
  try {
    const { q, category, seller, minPrice, maxPrice, sort = "createdAt", order = "desc", page = 1, limit = 20 } = req.query;
    const query = {};
    if (q) query.name = { $regex: q, $options: "i" };
    if (category) query.category = category;
    if (seller) query.seller = seller;
    if (minPrice || maxPrice)
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {})
      };

    const skip = (Number(page) - 1) * Number(limit);
    const items = await Product.find(query)
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("seller", "name email");

    const total = await Product.countDocuments(query);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, currency, images, category, brand, stock, attributes } = req.body;
    const slug = slugify(name);
    const exists = await Product.findOne({ slug });
    if (exists) return res.status(409).json({ message: "Product with same name already exists" });

    const product = await Product.create({
      seller: req.user.id,
      name,
      slug,
      description,
      price,
      currency: currency || "INR",
      images: images || [],
      category,
      brand,
      stock: stock || 0,
      attributes: attributes || []
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    // Only seller or admin can update
    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    const updated = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

// Upload single image via Multer already handled in route; this just returns URL
exports.uploadImage = async (req, res, next) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const absoluteUrl = `${process.env.BASE_URL}${imageUrl}`;
    res.status(201).json({ imageUrl, absoluteUrl });
  } catch (err) {
    next(err);
  }
};
