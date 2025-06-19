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
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['created', 'DESC']]
      });
    } else {
      orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['created', 'DESC']]
      });
    }

    res.status(200).json({
      orders
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
          attributes: ['id', 'firstName', 'lastName', 'email']
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// create order api
router.post('/add', auth, async (req, res) => {
  try {
    const { total, shippingAddress, paymentMethod } = req.body;

    if (!total) {
      return res.status(400).json({ error: 'You must enter a total.' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'You must enter a shipping address.' });
    }

    // Get user's cart items
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
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
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      total,
      userId: req.user.id,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update product quantities
    for (const item of cartItems) {
      await item.product.update({
        quantity: item.product.quantity - item.quantity
      });
    }

    // Clear cart
    await Cart.destroy({ where: { userId: req.user.id } });

    res.status(200).json({
      success: true,
      message: 'Order has been placed successfully!',
      order
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// cancel order api
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { id: orderId, userId: req.user.id }
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
