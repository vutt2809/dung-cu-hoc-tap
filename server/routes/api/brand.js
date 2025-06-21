const express = require('express');
const router = express.Router();
const multer = require('multer');

// Bring in Models & Helpers
const { Brand } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { s3Upload } = require('../../utils/storage');
const { ROLES } = require('../../constants');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fetch store brands api
router.get('/list', async (req, res) => {
  try {
    const brands = await Brand.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'description', 'logo']
    });

    res.status(200).json({
      brands
    });
  } catch (error) {
    res.status(500).json({
      error: 'Brand list error: ' + error.message
    });
  }
});

// fetch brands api
router.get('/', auth, async (req, res) => {
  try {
    const brands = await Brand.findAll({
      attributes: ['id', 'name', 'description', 'is_active', 'created_at']
    });

    res.status(200).json({
      brands
    });
  } catch (error) {
    res.status(500).json({
      error: 'Brand list error: ' + error.message
    });
  }
});

// fetch brand api
router.get('/:id', auth, async (req, res) => {
  try {
    const brand_id = req.params.id;

    const brandDoc = await Brand.findByPk(brand_id);

    if (!brandDoc) {
      return res.status(404).json({
        message: 'No brand found.'
      });
    }

    res.status(200).json({
      brand: brandDoc
    });
  } catch (error) {
    res.status(500).json({
      error: 'Brand error: ' + error.message
    });
  }
});

// add brand api
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.single('logo'),
  async (req, res) => {
    try {
      const name = req.body.name;
      const description = req.body.description;
      const is_active = req.body.is_active;
      const logo = req.file;

      if (!name) {
        return res.status(400).json({ error: 'You must enter a name.' });
      }

      const foundBrand = await Brand.findOne({ where: { name } });

      if (foundBrand) {
        return res.status(400).json({ error: 'This name is already in use.' });
      }

      let logoUrl = '';
      let logoKey = '';

      if (logo) {
        const logoData = await s3Upload(logo);
        logoUrl = logoData.Location;
        logoKey = logoData.Key;
      }

      const brand = await Brand.create({
        name,
        description,
        is_active,
        logo: logoUrl
      });

      res.status(200).json({
        success: true,
        message: `Brand has been added successfully!`,
        brand
      });
    } catch (error) {
      res.status(500).json({
        error: 'Brand add error: ' + error.message
      });
    }
  }
);

// update brand api
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  upload.single('logo'),
  async (req, res) => {
    try {
      const brand_id = req.params.id;
      const update = req.body.brand;
      const logo = req.file;

      const brand = await Brand.findByPk(brand_id);

      if (!brand) {
        return res.status(404).json({
          message: 'No brand found.'
        });
      }

      if (logo) {
        const logoData = await s3Upload(logo);
        update.logo = logoData.Location;
      }

      await brand.update(update);

      res.status(200).json({
        success: true,
        message: 'Brand has been updated successfully!',
        brand
      });
    } catch (error) {
      res.status(500).json({
        error: 'Brand update error: ' + error.message
      });
    }
  }
);

// delete brand api
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);

    if (!brand) {
      return res.status(404).json({
        message: 'No brand found.'
      });
    }

    await brand.destroy();

    res.status(200).json({
      success: true,
      message: 'Brand has been deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Brand delete error: ' + error.message
    });
  }
});

module.exports = router;
