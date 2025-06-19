const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { Cart, Product } = require('../../models');
const auth = require('../../middleware/auth');

// fetch cart api
router.get('/', auth, async (req, res) => {
  try {
    const cartDoc = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name', 'image_url', 'price', 'quantity']
        }
      ]
    });

    res.status(200).json({
      cart: cartDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// add product to cart api
router.post('/add', auth, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'You must enter a product id.' });
    }

    if (!quantity) {
      return res.status(400).json({ error: 'You must enter a quantity.' });
    }

    const product = await Product.findOne({ where: { id: product_id } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Quantity exceeds stock.' });
    }

    const existingCartItem = await Cart.findOne({
      where: { user_id: req.user.id, product_id }
    });

    if (existingCartItem) {
      await existingCartItem.update({
        quantity: existingCartItem.quantity + quantity
      });
    } else {
      await Cart.create({
        user_id: req.user.id,
        product_id,
        quantity,
        price: product.price
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product has been added to your cart!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// update product quantity in cart api
router.put('/update/:id', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartId = req.params.id;

    if (!quantity) {
      return res.status(400).json({ error: 'You must enter a quantity.' });
    }

    const cartItem = await Cart.findOne({
      where: { id: cartId, user_id: req.user.id },
      include: [{ model: Product, as: 'product' }]
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    if (cartItem.product.quantity < quantity) {
      return res.status(400).json({ error: 'Quantity exceeds stock.' });
    }

    await cartItem.update({ quantity });

    res.status(200).json({
      success: true,
      message: 'Cart has been updated!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// delete product from cart api
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const cartId = req.params.id;

    const cartItem = await Cart.findOne({
      where: { id: cartId, user_id: req.user.id }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }

    await cartItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Product has been removed from your cart!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
