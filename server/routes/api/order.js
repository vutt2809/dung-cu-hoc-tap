const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { Order, Cart, Product, User } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// fetch orders api
router.get('/', auth, async (req, res) => {
  try {
    let orders = null;

    if (req.user.role === ROLES.Admin) {
      orders = await Order.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['created_at', 'DESC']]
      });
    } else {
      orders = await Order.findAll({
        where: { user_id: req.user.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['created_at', 'DESC']]
      });
    }

    res.status(200).json({
      orders
    });
  } catch (error) {
    res.status(500).json({
      error: 'Order list error: ' + error.message
    });
  }
});

// fetch order api
router.get('/:id', auth, async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderDoc = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!orderDoc) {
      return res.status(404).json({
        message: 'No order found.'
      });
    }

    res.status(200).json({
      order: orderDoc
    });
  } catch (error) {
    res.status(500).json({
      error: 'Order error: ' + error.message
    });
  }
});

// create order api
router.post('/add', auth, async (req, res) => {
  try {
    const { total, shipping_address, payment_method } = req.body;

    if (!total) {
      return res.status(400).json({ error: 'You must enter a total.' });
    }

    if (!shipping_address) {
      return res.status(400).json({ error: 'You must enter a shipping address.' });
    }

    // Get user's cart items
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'quantity']
        }
      ]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.product.quantity < item.quantity) {
        return res.status(400).json({
          error: `${item.product.name} is out of stock.`
        });
      }
    }

    // Create order
    const order = await Order.create({
      order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      total,
      user_id: req.user.id,
      shipping_address,
      payment_method,
      status: 'pending',
      payment_status: 'pending'
    });

    // Update product quantities
    for (const item of cartItems) {
      await item.product.update({
        quantity: item.product.quantity - item.quantity
      });
    }

    // Clear cart
    await Cart.destroy({ where: { user_id: req.user.id } });

    res.status(200).json({
      success: true,
      message: 'Order has been placed successfully!',
      order
    });
  } catch (error) {
    res.status(500).json({
      error: 'Order add error: ' + error.message
    });
  }
});

// update order status api
router.put('/:id/status', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'No order found.'
      });
    }

    await order.update({ status });

    res.status(200).json({
      success: true,
      message: 'Order status has been updated successfully!',
      order
    });
  } catch (error) {
    res.status(500).json({
      error: 'Order status update error: ' + error.message
    });
  }
});

// cancel order api
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { id: orderId, user_id: req.user.id }
    });

    if (!order) {
      return res.status(404).json({
        message: 'No order found.'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        error: 'Order cannot be cancelled.'
      });
    }

    await order.update({ status: 'cancelled' });

    res.status(200).json({
      success: true,
      message: 'Order has been cancelled successfully!'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Order cancel error: ' + error.message
    });
  }
});

module.exports = router;
