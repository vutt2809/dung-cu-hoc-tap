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
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['created', 'DESC']]
    });

    res.status(200).json({
      merchants
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch merchant api
router.get('/:id', auth, async (req, res) => {
  try {
    const merchantId = req.params.id;

    const merchantDoc = await Merchant.findByPk(merchantId, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'firstName', 'lastName', 'email']
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
      const { name, email, phoneNumber, brand, business } = req.body;
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
        phoneNumber,
        brand,
        business,
        avatar: avatarUrl,
        isActive: false,
        isVerified: false,
        status: MERCHANT_STATUS.Waiting_Approval
      });

      res.status(200).json({
        success: true,
        message: 'Merchant has been added successfully!',
        merchant
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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
      const merchantId = req.params.id;
      const update = req.body.merchant;
      const avatar = req.file;

      const merchant = await Merchant.findByPk(merchantId);

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
    const merchantId = req.params.id;

    const merchant = await Merchant.findByPk(merchantId);

    if (!merchant) {
      return res.status(404).json({
        message: 'No merchant found.'
      });
    }

    await merchant.update({
      status: MERCHANT_STATUS.Approved,
      isActive: true,
      isVerified: true
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
    const merchantId = req.params.id;

    const merchant = await Merchant.findByPk(merchantId);

    if (!merchant) {
      return res.status(404).json({
        message: 'No merchant found.'
      });
    }

    await merchant.update({
      status: MERCHANT_STATUS.Rejected,
      isActive: false,
      isVerified: false
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
