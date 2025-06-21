const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Op } = require('sequelize');

// Bring in Models & Utils
const { Product, Brand, Category, Merchant, User } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const { s3Upload } = require('../../utils/storage');
const { ROLES } = require('../../constants');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fetch product slug api
router.get('/item/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;

    const productDoc = await Product.findOne({
      where: { slug, is_active: true },
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['name', 'is_active']
        }
      ]
    });

    const hasNoBrand =
      productDoc?.brand === null || productDoc?.brand?.is_active === false;

    if (!productDoc || hasNoBrand) {
      return res.status(404).json({
        message: 'No product found.'
      });
    }

    res.status(200).json({
      product: productDoc
    });
  } catch (error) {
    res.status(500).json({
      error: 'Product item error: ' + error.message
    });
  }
});

// fetch product name search api
router.get('/list/search/:name', async (req, res) => {
  try {
    const name = req.params.name;

    const productDoc = await Product.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
        is_active: true
      },
      attributes: ['name', 'slug', 'image_url', 'price']
    });

    if (productDoc.length < 0) {
      return res.status(404).json({
        message: 'No product found.'
      });
    }

    res.status(200).json({
      products: productDoc
    });
  } catch (error) {
    res.status(500).json({
      error: 'Product search error: ' + error.message
    });
  }
});

// fetch store products by advanced filters api
router.get('/list', async (req, res) => {
  try {
    let {
      sortOrder,
      rating,
      max,
      min,
      category,
      page = 1,
      limit = 10
    } = req.body;

    const where = {};
    if (max && min) {
      where.price = {
        [Op.between]: [min, max]
      };
    } else if (max) {
      where.price = {
        [Op.lte]: max
      };
    } else if (min) {
      where.price = {
        [Op.gte]: min
      };
    }

    if (rating) {
      where.rating = {
        [Op.gte]: rating
      };
    }

    const categoryFilter = category ? { name: category } : {};

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Brand,
          as: 'brand',
          include: {
            model: Merchant,
            as: 'merchant'
          }
        },
        {
          model: Category,
          as: 'category',
          where: categoryFilter
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['created_at', sortOrder ?? 'DESC']]
    });

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      count
    });
  } catch (error) {
    res.status(500).json({
      error: 'Product list error: ' + error.message
    });
  }
});

router.get('/list/select', auth, async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['name']
    });

    res.status(200).json({
      products
    });
  } catch (error) {
    res.status(500).json({
      error: 'Product list select error: ' + error.message
    });
  }
});

// add product api
router.post(
  '/add',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  upload.single('image'),
  async (req, res) => {
    try {
      const sku = req.body.sku;
      const name = req.body.name;
      const description = req.body.description;
      const quantity = req.body.quantity;
      const price = req.body.price;
      const taxable = req.body.taxable;
      const is_active = req.body.is_active;
      const brand_id = req.body.brand;
      const image = req.file;

      if (!sku) {
        return res.status(400).json({ error: 'You must enter sku.' });
      }

      if (!description || !name) {
        return res
          .status(400)
          .json({ error: 'You must enter description & name.' });
      }

      if (!quantity) {
        return res.status(400).json({ error: 'You must enter a quantity.' });
      }

      if (!price) {
        return res.status(400).json({ error: 'You must enter a price.' });
      }

      const foundProduct = await Product.findOne({ where: { sku } });

      if (foundProduct) {
        return res.status(400).json({ error: 'This sku is already in use.' });
      }

      let image_url = '';
      let image_key = '';

      if (image) {
        const imageData = await s3Upload(image);
        image_url = imageData.Location;
        image_key = imageData.Key;
      }

      const product = await Product.create({
        sku,
        name,
        description,
        quantity,
        price,
        taxable,
        is_active,
        brand_id,
        image_url,
        image_key,
        slug: name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
      });

      res.status(200).json({
        success: true,
        message: `Product has been added successfully!`,
        product
      });
    } catch (error) {
      res.status(500).json({
        error: 'Product add error: ' + error.message
      });
    }
  }
);

// fetch products api
router.get(
  '/',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      let products = [];
      const user = await User.findByPk(req.user.id);

      if (user.merchant_id) {
        const brands = await Brand.findAll({
          where: {
            merchant_id: user.merchant_id
          }
        });

        const brand_ids = brands.map(b => b.id);

        products = await Product.findAll({
          where: {
            brand_id: {
              [Op.in]: brand_ids
            }
          },
          include: {
            model: Brand,
            as: 'brand',
            include: {
              model: Merchant,
              as: 'merchant'
            }
          }
        });
      } else {
        products = await Product.findAll({
          include: {
            model: Brand,
            as: 'brand',
            include: {
              model: Merchant,
              as: 'merchant'
            }
          }
        });
      }

      res.status(200).json({
        products
      });
    } catch (error) {
      res.status(500).json({
        error: 'Product list error: ' + error.message
      });
    }
  }
);

// fetch product api
router.get(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      const product_id = req.params.id;
      let productDoc = null;
      const user = await User.findByPk(req.user.id);

      if (user.merchant_id) {
        const brands = await Brand.findAll({
          where: {
            merchant_id: user.merchant_id
          }
        });
        const brand_ids = brands.map(b => b.id);
        productDoc = await Product.findOne({
          where: {
            id: product_id,
            brand_id: {
              [Op.in]: brand_ids
            }
          },
          include: [
            {
              model: Brand,
              as: 'brand',
              attributes: ['name']
            }
          ]
        });
      } else {
        productDoc = await Product.findOne({
          where: { id: product_id },
          include: [
            {
              model: Brand,
              as: 'brand',
              attributes: ['name']
            }
          ]
        });
      }
      if (!productDoc) {
        return res.status(404).json({
          message: 'No product found.'
        });
      }
      res.status(200).json({
        product: productDoc
      });
    } catch (error) {
      res.status(500).json({
        error: 'Product error: ' + error.message
      });
    }
  }
);

router.put(
  '/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  upload.single('image'),
  async (req, res) => {
    try {
      const product_id = req.params.id;
      const update = req.body;
      const { sku, slug } = req.body;
      const image = req.file;

      if (image) {
        const { image_url, image_key } = await s3Upload(image);
        update.image_url = image_url;
        update.image_key = image_key;
      }

      const foundProduct = await Product.findOne({
        where: {
          [Op.or]: [{ slug }, { sku }],
          id: { [Op.ne]: product_id }
        }
      });

      if (foundProduct) {
        return res
          .status(400)
          .json({ error: 'Sku or slug is already in use.' });
      }

      await Product.update(update, { where: { id: product_id } });

      res.status(200).json({
        success: true,
        message: 'Sản phẩm đã được cập nhật thành công!'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Product update error: ' + error.message
      });
    }
  }
);

router.put(
  '/:id/active',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      const product_id = req.params.id;
      const update = req.body.product;

      await Product.update(update, { where: { id: product_id } });

      res.status(200).json({
        success: true,
        message: 'Product has been updated successfully!'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Product active error: ' + error.message
      });
    }
  }
);

router.delete(
  '/delete/:id',
  auth,
  role.check(ROLES.Admin, ROLES.Merchant),
  async (req, res) => {
    try {
      await Product.destroy({ where: { id: req.params.id } });

      res.status(200).json({
        success: true,
        message: `Product has been deleted successfully!`
      });
    } catch (error) {
      res.status(500).json({
        error: 'Product delete error: ' + error.message
      });
    }
  }
);

module.exports = router;
