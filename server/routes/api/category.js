const express = require('express');
const router = express.Router();
const multer = require('multer');

// Bring in Models & Helpers
const { Category } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { s3Upload } = require('../../utils/storage');
const { ROLES } = require('../../constants');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fetch store categories api
router.get('/list', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'description'],
      include: [
        {
          model: Category,
          as: 'children',
          where: { is_active: true },
          required: false,
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    res.status(200).json({
      categories
    });
  } catch (error) {
    res.status(500).json({
      error: 'Category list error: ' + error.message
    });
  }
});

// fetch categories api
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'description', 'is_active', 'parent_id', 'created_at'],
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(200).json({
      categories
    });
  } catch (error) {
    res.status(500).json({
      error: 'Category list error: ' + error.message
    });
  }
});

// fetch category api
router.get('/:id', auth, async (req, res) => {
  try {
    const category_id = req.params.id;

    const categoryDoc = await Category.findByPk(category_id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'children',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!categoryDoc) {
      return res.status(404).json({
        message: 'No category found.'
      });
    }

    res.status(200).json({
      category: categoryDoc
    });
  } catch (error) {
    res.status(500).json({
      error: 'Category error: ' + error.message
    });
  }
});

// add category api
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin),
  upload.single('image'),
  async (req, res) => {
    try {
      const name = req.body.name;
      const description = req.body.description;
      const is_active = req.body.is_active;
      const parent_id = req.body.parent_id;
      const image = req.file;

      if (!name) {
        return res.status(400).json({ error: 'You must enter a name.' });
      }

      const foundCategory = await Category.findOne({ where: { name } });

      if (foundCategory) {
        return res.status(400).json({ error: 'This name is already in use.' });
      }

      let image_url = '';
      let image_key = '';

      if (image) {
        const imageData = await s3Upload(image);
        image_url = imageData.Location;
        image_key = imageData.Key;
      }

      const category = await Category.create({
        name,
        description,
        is_active,
        parent_id: parent_id || null
      });

      res.status(200).json({
        success: true,
        message: `Category has been added successfully!`,
        category
      });
    } catch (error) {
      res.status(500).json({
        error: 'Category add error: ' + error.message
      });
    }
  }
);

// update category api
router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin),
  upload.single('image'),
  async (req, res) => {
    try {
      const category_id = req.params.id;
      const update = req.body.category;
      const image = req.file;

      const category = await Category.findByPk(category_id);

      if (!category) {
        return res.status(404).json({
          message: 'No category found.'
        });
      }

      if (image) {
        const imageData = await s3Upload(image);
        update.image_url = imageData.Location;
        update.image_key = imageData.Key;
      }

      await category.update(update);

      res.status(200).json({
        success: true,
        message: 'Category has been updated successfully!',
        category
      });
    } catch (error) {
      res.status(500).json({
        error: 'Category update error: ' + error.message
      });
    }
  }
);

// delete category api
router.delete('/delete/:id', auth, role.check(ROLES.Admin), async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'No category found.'
      });
    }

    // Check if category has children
    const children = await Category.findAll({ where: { parent_id: req.params.id } });
    if (children.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with subcategories.'
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: 'Category has been deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Category delete error: ' + error.message
    });
  }
});

module.exports = router;
