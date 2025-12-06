import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Termékek lekérése sikertelen' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Termék nem található' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Termék lekérése sikertelen' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, image_url } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Név és ár kötelező' });
    }

    const newProduct = await Product.create({ name, description, price, stock_quantity, image_url });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: 'Termék létrehozása sikertelen' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Termék nem található' });

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Termék frissítése sikertelen' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Termék nem található' });

    await product.destroy();
    res.json({ message: 'Termék törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Termék törlése sikertelen' });
  }
};
