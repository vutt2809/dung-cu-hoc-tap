const express = require('express');
const router = express.Router();
const multer = require('multer');

// Bring in Models & Helpers
const { Merchant, User } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { s3Upload } = require('../../utils/storage');
const { ROLES, MERCHANT_STATUS } = require('../../constants');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fetch merchants api
router.get('/', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const merchants = await Merchant.findAll({
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      merchants
    });
  } catch (error) {
    res.status(500).json({
      error: 'Merchant list error: ' + error.message
    });
  }
});

// fetch merchant api
router.get('/:id', auth, async (req, res) => {
  try {
    const merchant_id = req.params.id;

    const merchantDoc = await Merchant.findByPk(merchant_id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!merchantDoc) {
      return res.status(404).json({
        message: 'No merchant found.'
      });
    }

    res.status(200).json({
      merchant: merchantDoc
    });
  } catch (error) {
    res.status(500).json({
      error: 'Merchant error: ' + error.message
    });
  }
});

// add merchant api
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.single('avatar'),
  async (req, res) => {
    try {
      const { name, email, phone_number, brand, business } = req.body;
      const avatar = req.file;

      if (!name) {
        return res.status(400).json({ error: 'You must enter a name.' });
      }

      if (!email) {
        return res.status(400).json({ error: 'You must enter an email address.' });
      }

      const existingMerchant = await Merchant.findOne({ where: { email } });

      if (existingMerchant) {
        return res.status(400).json({ error: 'That email address is already in use.' });
      }

      let avatarUrl = '';
      let avatarKey = '';

      if (avatar) {
        const avatarData = await s3Upload(avatar);
        avatarUrl = avatarData.Location;
        avatarKey = avatarData.Key;
      }

      const merchant = await Merchant.create({
        name,
        email,
        phone_number,
        brand,
        business,
        avatar: avatarUrl,
        is_active: false,
        is_verified: false,
        status: MERCHANT_STATUS.Waiting_Approval
      });

      res.status(200).json({
        success: true,
        message: 'Merchant has been added successfully!',
        merchant
      });
    } catch (error) {
      res.status(500).json({
        error: 'Merchant update error: ' + error.message
      });
    }
  }
);

// update merchant api
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  upload.single('avatar'),
  async (req, res) => {
    try {
      const merchant_id = req.params.id;
      const update = req.body.merchant;
      const avatar = req.file;

      const merchant = await Merchant.findByPk(merchant_id);

      if (!merchant) {
        return res.status(404).json({
          message: 'No merchant found.'
        });
      }

      if (avatar) {
        const avatarData = await s3Upload(avatar);
        update.avatar = avatarData.Location;
      }

      await merchant.update(update);

      res.status(200).json({
        success: true,
        message: 'Merchant has been updated successfully!',
        merchant
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

// approve merchant api
router.put('/:id/approve', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const merchant_id = req.params.id;

    const merchant = await Merchant.findByPk(merchant_id);

    if (!merchant) {
      return res.status(404).json({
        message: 'No merchant found.'
      });
    }

    await merchant.update({
      status: MERCHANT_STATUS.Approved,
      is_active: true,
      is_verified: true
    });

    res.status(200).json({
      success: true,
      message: 'Merchant has been approved successfully!',
      merchant
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// reject merchant api
router.put('/:id/reject', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const merchant_id = req.params.id;

    const merchant = await Merchant.findByPk(merchant_id);

    if (!merchant) {
      return res.status(404).json({
        message: 'No merchant found.'
      });
    }

    await merchant.update({
      status: MERCHANT_STATUS.Rejected,
      is_active: false,
      is_verified: false
    });

    res.status(200).json({
      success: true,
      message: 'Merchant has been rejected successfully!',
      merchant
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// delete merchant api
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const merchant = await Merchant.findByPk(req.params.id);

    if (!merchant) {
      return res.status(404).json({
        message: 'No merchant found.'
      });
    }

    await merchant.destroy();

    res.status(200).json({
      success: true,
      message: 'Merchant has been deleted successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
