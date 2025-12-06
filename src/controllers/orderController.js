import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Rendelések lekérése sikertelen' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }]
    });
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Rendelés nem található' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Rendelés lekérése sikertelen' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body; 
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Legalább egy termék szükséges' });
    }

    let total = 0;
    const order = await Order.create({ userId: req.user.id, status: 'pending', total_amount: 0 });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) continue;

      const price = product.price;
      total += price * item.quantity;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price
      });
    }

    await order.update({ total_amount: total });
    const fullOrder = await Order.findByPk(order.id, { include: [{ model: OrderItem, include: [Product] }] });

    res.status(201).json(fullOrder);
  } catch (error) {
    res.status(400).json({ error: 'Rendelés létrehozása sikertelen' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Rendelés nem található' });
    }

    await order.update(req.body);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Rendelés frissítése sikertelen' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Rendelés nem található' });
    }

    await order.destroy();
    res.json({ message: 'Rendelés törölve' });
  } catch (error) {
    res.status(500).json({ error: 'Rendelés törlése sikertelen' });
  }
};
