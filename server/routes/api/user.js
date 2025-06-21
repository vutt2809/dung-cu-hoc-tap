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
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at'],
      where: {
        $or: [
          { first_name: { $iLike: regex } },
          { last_name: { $iLike: regex } },
          { email: { $iLike: regex } }
        ]
      }
    });

    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(500).json({
      error: 'User list error: ' + error.message
    });
  }
});

// fetch users api
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at']
    });

    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(500).json({
      error: 'User list error: ' + error.message
    });
  }
});

// fetch user api
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at']
    });

    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      error: 'User profile error: ' + error.message
    });
  }
});

// update user api
router.put('/profile', auth, async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

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
      first_name,
      last_name,
      email
    });

    res.status(200).json({
      success: true,
      message: 'Profile has been updated!'
    });
  } catch (error) {
    res.status(500).json({
      error: 'User profile update error: ' + error.message
    });
  }
});

// fetch user api
router.get('/me', auth, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

module.exports = router;
