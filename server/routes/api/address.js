const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { Address, User } = require('../../models');
const auth = require('../../middleware/auth');

// fetch addresses api
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
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
      addresses
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch address api
router.get('/:id', auth, async (req, res) => {
  try {
    const addressId = req.params.id;

    const addressDoc = await Address.findOne({
      where: { id: addressId, user_id: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!addressDoc) {
      return res.status(404).json({
        message: 'No address found.'
      });
    }

    res.status(200).json({
      address: addressDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// add address api
router.post('/add', auth, async (req, res) => {
  try {
    const { address, city, state, zip_code, country, phone_number, is_default } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'You must enter an address.' });
    }

    if (!city) {
      return res.status(400).json({ error: 'You must enter a city.' });
    }

    if (!state) {
      return res.status(400).json({ error: 'You must enter a state.' });
    }

    if (!zip_code) {
      return res.status(400).json({ error: 'You must enter a zip code.' });
    }

    if (!country) {
      return res.status(400).json({ error: 'You must enter a country.' });
    }

    // If this is the default address, unset other default addresses
    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id } }
      );
    }

    const newAddress = await Address.create({
      user_id: req.user.id,
      address,
      city,
      state,
      zip_code,
      country,
      phone_number,
      is_default: is_default || false
    });

    res.status(200).json({
      success: true,
      message: 'Address has been added successfully!',
      address: newAddress
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// update address api
router.put('/:id', auth, async (req, res) => {
  try {
    const addressId = req.params.id;
    const { address, city, state, zip_code, country, phone_number, is_default } = req.body;

    const addressDoc = await Address.findOne({
      where: { id: addressId, user_id: req.user.id }
    });

    if (!addressDoc) {
      return res.status(404).json({
        message: 'No address found.'
      });
    }

    // If this is the default address, unset other default addresses
    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id, id: { [require('sequelize').Op.ne]: addressId } } }
      );
    }

    await addressDoc.update({
      address,
      city,
      state,
      zip_code,
      country,
      phone_number,
      is_default: is_default || false
    });

    res.status(200).json({
      success: true,
      message: 'Address has been updated successfully!',
      address: addressDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// delete address api
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!address) {
      return res.status(404).json({
        message: 'No address found.'
      });
    }

    await address.destroy();

    res.status(200).json({
      success: true,
      message: 'Address has been deleted successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
