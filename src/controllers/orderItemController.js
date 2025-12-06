import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.findAll({
      include: [Product, Order]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Rendelés tételek lekérése sikertelen' });
  }
};

export const createOrderItem = async (req, res) => {
  try {
    const { orderId, productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Termék nem található' });

    const order = await Order.findByPk(orderId);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Rendelés nem található vagy nincs jogosultság' });
    }

    const item = await OrderItem.create({
      orderId,
      productId,
      quantity,
      price: product.price
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Rendelés tétel létrehozása sikertelen' });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Tétel nem található' });

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: 'Tétel frissítése sikertelen' });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const item = await OrderItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Tétel nem található' });

    await item.destroy();
    res.json({ message: 'Tétel törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Tétel törlése sikertelen' });
  }
};
