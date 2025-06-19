const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { Review, Product, User } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// fetch product reviews api
router.get('/list/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.findAll({
      where: { productId, isActive: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
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
          attributes: ['id', 'name', 'imageUrl']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
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
          attributes: ['id', 'name', 'imageUrl']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
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
    const { productId, rating, title, comment } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'You must enter a product id.' });
    }

    if (!rating) {
      return res.status(400).json({ error: 'You must enter a rating.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating,
      title,
      comment,
      isActive: true
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
      where: { id: reviewId, userId: req.user.id }
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
      where: { id: req.params.id, userId: req.user.id }
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
    const { isActive } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({
        message: 'No review found.'
      });
    }

    await review.update({ isActive });

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
