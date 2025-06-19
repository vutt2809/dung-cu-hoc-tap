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
      where: { slug, isActive: true },
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['name', 'isActive']
        }
      ]
    });

    const hasNoBrand =
      productDoc?.brand === null || productDoc?.brand?.isActive === false;

    if (!productDoc || hasNoBrand) {
      return res.status(404).json({
        message: 'No product found.'
      });
    }

    res.status(200).json({
      product: productDoc
    });
  } catch (error) {
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
        isActive: true
      },
      attributes: ['name', 'slug', 'imageUrl', 'price']
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
    sortOrder = JSON.parse(sortOrder);

    const whereClause = { isActive: true };

    if (min || max) {
      whereClause.price = {};
      if (min) whereClause.price[Op.gte] = min;
      if (max) whereClause.price[Op.lte] = max;
    }

    const includeClause = [
      {
        model: Brand,
        as: 'brand',
        where: brand ? { name: brand } : undefined,
        required: !!brand
      },
      {
        model: Category,
        as: 'category',
        where: category ? { name: category } : undefined,
        required: !!category
      }
    ];

    const userDoc = await checkAuth(req);

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [sortOrder],
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
    res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
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
      const isActive = req.body.isActive;
      const brandId = req.body.brand;
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

      let imageUrl = '';
      let imageKey = '';

      if (image) {
        const imageData = await s3Upload(image);
        imageUrl = imageData.Location;
        imageKey = imageData.Key;
      }

      const product = await Product.create({
        sku,
        name,
        description,
        quantity,
        price,
        taxable,
        isActive,
        brandId,
        imageUrl,
        imageKey,
        slug: name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
      });

      res.status(200).json({
        success: true,
        message: `Product has been added successfully!`,
        product
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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

        const brandId = brands[0]?.['_id'];

        products = await Product.find({})
          .populate({
            path: 'brand',
            populate: {
              path: 'merchant',
              model: 'Merchant'
            }
          })
          .where('brand', brandId);
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
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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
      const productId = req.params.id;

      let productDoc = null;

      if (req.user.merchant) {
        const brands = await Brand.find({
          merchant: req.user.merchant
        }).populate('merchant', '_id');

        const brandId = brands[0]['_id'];

        productDoc = await Product.findOne({ _id: productId })
          .populate({
            path: 'brand',
            select: 'name'
          })
          .where('brand', brandId);
      } else {
        productDoc = await Product.findOne({ _id: productId }).populate({
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
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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
      const productId = req.params.id;
      const update = req.body.product;
      const query = { _id: productId };
      const { sku, slug } = req.body.product;

      const foundProduct = await Product.findOne({
        $or: [{ slug }, { sku }]
      });

      if (foundProduct && foundProduct._id != productId) {
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
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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
      const productId = req.params.id;
      const update = req.body.product;
      const query = { _id: productId };

      await Product.findOneAndUpdate(query, update, {
        new: true
      });

      res.status(200).json({
        success: true,
        message: 'Product has been updated successfully!'
      });
    } catch (error) {
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
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
      res.status(400).json({
        error: 'Your request could not be processed. Please try again.'
      });
    }
  }
);

module.exports = router;
