const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { Wishlist, Product } = require('../../models');
const auth = require('../../middleware/auth');

// fetch wishlist api
router.get('/', auth, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image_url', 'price', 'quantity']
        }
      ],
      order: [['created', 'DESC']]
    });

    res.status(200).json({
      wishlist: wishlistItems
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// add product to wishlist api
router.post('/add', auth, async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'You must enter a product id.' });
    }

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const existingWishlistItem = await Wishlist.findOne({
      where: { user_id: req.user.id, product_id }
    });

    if (existingWishlistItem) {
      return res.status(400).json({ error: 'Product is already in your wishlist.' });
    }

    await Wishlist.create({
      user_id: req.user.id,
      product_id
    });

    res.status(200).json({
      success: true,
      message: 'Product has been added to your wishlist!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// remove product from wishlist api
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const wishlistId = req.params.id;

    const wishlistItem = await Wishlist.findOne({
      where: { id: wishlistId, user_id: req.user.id }
    });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found.' });
    }

    await wishlistItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Product has been removed from your wishlist!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
