const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const { sequelize } = require('./db');
const { ROLES } = require('../constants');
const { User, Brand, Product, Category } = require('../models');

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

const NUM_PRODUCTS = 100;
const NUM_BRANDS = 10;
const NUM_CATEGORIES = 10;

const seedDB = async () => {
  try {
    let categories = [];

    console.log(`${chalk.blue('✓')} ${chalk.blue('Seed database started')}`);

    if (!email || !password) throw new Error('Missing arguments');

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Seeding admin user...')}`);

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await User.create({
        email,
        password: hash,
        firstName: 'admin',
        lastName: 'admin',
        role: ROLES.Admin
      });

      console.log(`${chalk.green('✓')} ${chalk.green('Admin user seeded.')}`);
    } else {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Admin user already exists, skipping seeding for admin user.')}`);
    }

    const categoriesCount = await Category.count();
    if (categoriesCount >= NUM_CATEGORIES) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of categories already exist, skipping seeding for categories.')}`);
      categories = await Category.findAll({ attributes: ['id'] });
    } else {
      for (let i = 0; i < NUM_CATEGORIES; i++) {
        const category = await Category.create({
          name: faker.commerce.department(),
          description: faker.lorem.sentence(),
          isActive: true
        });
        categories.push(category);
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Categories seeded.')}`);
    }

    const brandsCount = await Brand.count();
    if (brandsCount >= NUM_BRANDS) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of brands already exist, skipping seeding for brands.')}`);
    } else {
      for (let i = 0; i < NUM_BRANDS; i++) {
        await Brand.create({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          isActive: true
        });
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Brands seeded.')}`);
    }

    const productsCount = await Product.count();
    if (productsCount >= NUM_PRODUCTS) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of products already exist, skipping seeding for products.')}`);
    } else {
      const brands = await Brand.findAll({ attributes: ['id'] });
      for (let i = 0; i < NUM_PRODUCTS; i++) {
        const randomCategoryIndex = faker.number.int(categories.length - 1);
        const randomBrandIndex = faker.number.int(brands.length - 1);

        await Product.create({
          sku: faker.string.alphanumeric(10),
          name: faker.commerce.productName(),
          slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
          description: faker.lorem.sentence(),
          quantity: faker.number.int({ min: 1, max: 100 }),
          price: faker.commerce.price(),
          taxable: faker.datatype.boolean(),
          isActive: true,
          brandId: brands[randomBrandIndex].id,
          categoryId: categories[randomCategoryIndex].id
        });
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Products seeded and associated with categories.')}`);
    }
  } catch (error) {
    console.log(`${chalk.red('x')} ${chalk.red('Error while seeding database')}`);
    console.log(error);
    return null;
  } finally {
    await sequelize.close();
    console.log(`${chalk.blue('✓')} ${chalk.blue('Database connection closed!')}`);
  }
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');

    await seedDB();
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
  }
})();