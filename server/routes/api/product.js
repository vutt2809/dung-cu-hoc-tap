const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Op } = require('sequelize');

// Bring in Models & Utils
const { Product, Brand, Category } = require('../../models');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const checkAuth = require('../../utils/auth');
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
      brand,
      page = 1,
      limit = 10
    } = req.query;

    // Parse sortOrder safely and convert to Sequelize format
    let parsedSortOrder = [['id', 'DESC']]; // default sort
    if (sortOrder) {
      try {
        const sortObj = JSON.parse(sortOrder);
        // Convert MongoDB-style sort to Sequelize format
        parsedSortOrder = Object.entries(sortObj).map(([field, direction]) => {
          // Convert _id to id for Sequelize
          const fieldName = field === '_id' ? 'id' : field;
          const sortDirection = direction === -1 ? 'DESC' : 'ASC';
          return [fieldName, sortDirection];
        });
      } catch (e) {
        console.log('Invalid sortOrder:', sortOrder);
        parsedSortOrder = [['id', 'DESC']];
      }
    }

    const whereClause = { is_active: true };

    if (min || max) {
      whereClause.price = {};
      if (min) whereClause.price[Op.gte] = min;
      if (max) whereClause.price[Op.lte] = max;
    }

    const includeClause = [
      {
        model: Brand,
        as: 'brand',
        where: brand && brand !== 'all' ? { name: brand } : undefined,
        required: !!brand && brand !== 'all'
      },
      {
        model: Category,
        as: 'category',
        where: category && category !== 'undefined' && category !== 'all' ? { name: category } : undefined,
        required: !!(category && category !== 'undefined' && category !== 'all')
      }
    ];

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: parsedSortOrder,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      count
    });
  } catch (error) {
    console.log('error', error);
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
        return res.status(400).json({ error: 'You must enter description & name.' });
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

      if (req.user.merchant) {
        const brands = await Brand.find({
          merchant: req.user.merchant
        }).populate('merchant', '_id');

        const brand_id = brands[0]?.['_id'];

        products = await Product.find({})
          .populate({
            path: 'brand',
            populate: {
              path: 'merchant',
              model: 'Merchant'
            }
          })
          .where('brand', brand_id);
      } else {
        products = await Product.find({}).populate({
          path: 'brand',
          populate: {
            path: 'merchant',
            model: 'Merchant'
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

      if (req.user.merchant) {
        const brands = await Brand.find({
          merchant: req.user.merchant
        }).populate('merchant', '_id');

        const brand_id = brands[0]['_id'];

        productDoc = await Product.findOne({ _id: product_id })
          .populate({
            path: 'brand',
            select: 'name'
          })
          .where('brand', brand_id);
      } else {
        productDoc = await Product.findOne({ _id: product_id }).populate({
          path: 'brand',
          select: 'name'
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
  async (req, res) => {
    try {
      const product_id = req.params.id;
      const update = req.body.product;
      const query = { _id: product_id };
      const { sku, slug } = req.body.product;

      const foundProduct = await Product.findOne({
        $or: [{ slug }, { sku }]
      });

      if (foundProduct && foundProduct._id != product_id) {
        return res
          .status(400)
          .json({ error: 'Sku or slug is already in use.' });
      }

      await Product.findOneAndUpdate(query, update, {
        new: true
      });

      res.status(200).json({
        success: true,
        message: 'Product has been updated successfully!'
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
      const query = { _id: product_id };

      await Product.findOneAndUpdate(query, update, {
        new: true
      });

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
      const product = await Product.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: `Product has been deleted successfully!`,
        product
      });
    } catch (error) {
      res.status(500).json({
        error: 'Product delete error: ' + error.message
      });
    }
  }
);

module.exports = router;
