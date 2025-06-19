const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { Review, Product, User } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// fetch product reviews api
router.get('/list/:product_id', async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const reviews = await Review.findAll({
      where: { product_id, is_active: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['created', 'DESC']]
    });

    res.status(200).json({
      reviews
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch reviews api
router.get('/', auth, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image_url']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      order: [['created', 'DESC']]
    });

    res.status(200).json({
      reviews
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch review api
router.get('/:id', auth, async (req, res) => {
  try {
    const reviewId = req.params.id;

    const reviewDoc = await Review.findByPk(reviewId, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image_url']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!reviewDoc) {
      return res.status(404).json({
        message: 'No review found.'
      });
    }

    res.status(200).json({
      review: reviewDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// add review api
router.post('/add', auth, async (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'You must enter a product id.' });
    }

    if (!rating) {
      return res.status(400).json({ error: 'You must enter a rating.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { user_id: req.user.id, product_id }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      product_id,
      user_id: req.user.id,
      rating,
      title,
      comment,
      is_active: true
    });

    res.status(200).json({
      success: true,
      message: 'Review has been added successfully!',
      review
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// update review api
router.put('/:id', auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({
      where: { id: reviewId, user_id: req.user.id }
    });

    if (!review) {
      return res.status(404).json({
        message: 'No review found.'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    await review.update({
      rating: rating || review.rating,
      title: title || review.title,
      comment: comment || review.comment
    });

    res.status(200).json({
      success: true,
      message: 'Review has been updated successfully!',
      review
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// delete review api
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!review) {
      return res.status(404).json({
        message: 'No review found.'
      });
    }

    await review.destroy();

    res.status(200).json({
      success: true,
      message: 'Review has been deleted successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// approve/reject review api
router.put('/:id/status', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { is_active } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        message: 'No review found.'
      });
    }

    await review.update({ is_active });

    res.status(200).json({
      success: true,
      message: 'Review status has been updated successfully!',
      review
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
