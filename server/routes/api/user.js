const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const { User } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { ROLES } = require('../../constants');

// search users api
router.get('/search', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const { search } = req.query;

    const regex = new RegExp(search, 'i');

    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'created'],
      where: {
        $or: [
          { firstName: { $iLike: regex } },
          { lastName: { $iLike: regex } },
          { email: { $iLike: regex } }
        ]
      }
    });

    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch users api
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'created']
    });

    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch user api
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'created']
    });

    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// update user api
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'You must enter an email address.' });
    }

    const existingUser = await User.findOne({
      where: { email, id: { [require('sequelize').Op.ne]: req.user.id } }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'That email address is already in use.' });
    }

    const user = await User.findByPk(req.user.id);
    await user.update({
      firstName,
      lastName,
      email
    });

    res.status(200).json({
      success: true,
      message: 'Profile has been updated!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
