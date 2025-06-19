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
      where: { isActive: true },
      attributes: ['id', 'name', 'description', 'logo']
    });

    res.status(200).json({
      brands
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch brands api
router.get('/', auth, async (req, res) => {
  try {
    const brands = await Brand.findAll({
      attributes: ['id', 'name', 'description', 'isActive', 'created']
    });

    res.status(200).json({
      brands
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

// fetch brand api
router.get('/:id', auth, async (req, res) => {
  try {
    const brandId = req.params.id;

    const brandDoc = await Brand.findByPk(brandId);

    if (!brandDoc) {
      return res.status(404).json({
        message: 'No brand found.'
      });
    }

    res.status(200).json({
      brand: brandDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
      const isActive = req.body.isActive;
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
        isActive,
        logo: logoUrl
      });

      res.status(200).json({
        success: true,
        message: `Brand has been added successfully!`,
        brand
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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
      const brandId = req.params.id;
      const update = req.body.brand;
      const logo = req.file;

      const brand = await Brand.findByPk(brandId);

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
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});

module.exports = router;
