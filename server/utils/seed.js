const chalk = require('chalk');
const bcrypt = require('bcryptjs');

const { sequelize } = require('./db');
const { ROLES } = require('../constants');
const { User, Brand, Product, Category } = require('../models');

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

// Danh mục dụng cụ học tập
const CATEGORY_LIST = [
  { name: 'Bút', description: 'Các loại bút viết, bút chì, bút bi, bút mực...' },
  { name: 'Sách', description: 'Sách giáo khoa, sách tham khảo, truyện tranh...' },
  { name: 'Vở', description: 'Vở học sinh, sổ tay, giấy note...' },
  { name: 'Thước', description: 'Thước kẻ, eke, compa...' },
  { name: 'Màu', description: 'Bút màu, màu nước, màu sáp...' },
  { name: 'Balo', description: 'Balo, cặp sách, túi đựng dụng cụ...' },
  { name: 'Hộp bút', description: 'Hộp bút, túi bút...' },
  { name: 'Máy tính', description: 'Máy tính cầm tay, máy tính khoa học...' },
  { name: 'Đèn học', description: 'Đèn bàn, đèn học sinh...' },
  { name: 'Dụng cụ khác', description: 'Các dụng cụ học tập khác...' }
];

// Thương hiệu phổ biến
const BRAND_LIST = [
  { name: 'Thiên Long', description: 'Thương hiệu bút và văn phòng phẩm nổi tiếng Việt Nam.' },
  { name: 'Hồng Hà', description: 'Vở, giấy, văn phòng phẩm chất lượng.' },
  { name: 'Deli', description: 'Thương hiệu dụng cụ học tập quốc tế.' },
  { name: 'Staedtler', description: 'Bút chì, bút màu, dụng cụ vẽ nổi tiếng Đức.' },
  { name: 'Casio', description: 'Máy tính cầm tay, máy tính khoa học.' },
  { name: 'Double A', description: 'Giấy in, giấy viết cao cấp.' },
  { name: 'Campus', description: 'Vở, sổ tay Nhật Bản.' },
  { name: 'Artline', description: 'Bút vẽ kỹ thuật, bút highlight.' },
  { name: 'Faber-Castell', description: 'Bút màu, bút chì, dụng cụ mỹ thuật.' },
  { name: 'Flexoffice', description: 'Văn phòng phẩm, bút viết đa dạng.' }
];

// Sản phẩm mẫu
const PRODUCT_LIST = [
  {
    name: 'Bút bi Thiên Long 0.5mm',
    description: 'Bút bi nét nhỏ, mực xanh, viết êm tay.',
    price: 5000,
    quantity: 200,
    brand: 'Thiên Long',
    category: 'Bút'
  },
  {
    name: 'Vở Campus 200 trang',
    description: 'Vở Campus Nhật Bản, giấy dày, viết không lem.',
    price: 18000,
    quantity: 100,
    brand: 'Campus',
    category: 'Vở'
  },
  {
    name: 'Máy tính Casio FX-580VN X',
    description: 'Máy tính khoa học cho học sinh, sinh viên.',
    price: 570000,
    quantity: 30,
    brand: 'Casio',
    category: 'Máy tính'
  },
  {
    name: 'Balo học sinh Hồng Hà',
    description: 'Balo nhẹ, chống nước, nhiều ngăn tiện lợi.',
    price: 220000,
    quantity: 50,
    brand: 'Hồng Hà',
    category: 'Balo'
  },
  {
    name: 'Bút chì gỗ Staedtler HB',
    description: 'Bút chì gỗ cao cấp, dễ gọt, nét đậm.',
    price: 7000,
    quantity: 150,
    brand: 'Staedtler',
    category: 'Bút'
  },
  {
    name: 'Màu sáp Faber-Castell 12 màu',
    description: 'Bộ màu sáp an toàn cho trẻ em.',
    price: 35000,
    quantity: 80,
    brand: 'Faber-Castell',
    category: 'Màu'
  },
  {
    name: 'Thước kẻ Deli 20cm',
    description: 'Thước nhựa trong suốt, vạch chia rõ ràng.',
    price: 6000,
    quantity: 120,
    brand: 'Deli',
    category: 'Thước'
  },
  {
    name: 'Giấy Double A A4',
    description: 'Giấy in, giấy photo chất lượng cao.',
    price: 65000,
    quantity: 60,
    brand: 'Double A',
    category: 'Vở'
  },
  {
    name: 'Hộp bút Flexoffice',
    description: 'Hộp bút nhựa nhiều ngăn, bền đẹp.',
    price: 25000,
    quantity: 90,
    brand: 'Flexoffice',
    category: 'Hộp bút'
  },
  {
    name: 'Đèn bàn học LED',
    description: 'Đèn LED tiết kiệm điện, bảo vệ mắt.',
    price: 120000,
    quantity: 40,
    brand: 'Deli',
    category: 'Đèn học'
  }
];

const seedDB = async () => {
  try {
    let categories = [];
    let brands = [];

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
        first_name: 'admin',
        last_name: 'admin',
        role: ROLES.Admin
      });

      console.log(`${chalk.green('✓')} ${chalk.green('Admin user seeded.')}`);
    } else {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Admin user already exists, skipping seeding for admin user.')}`);
    }

    // Seed categories
    const categoriesCount = await Category.count();
    if (categoriesCount >= CATEGORY_LIST.length) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of categories already exist, skipping seeding for categories.')}`);
      categories = await Category.findAll();
    } else {
      for (const cat of CATEGORY_LIST) {
        const category = await Category.create({
          name: cat.name,
          description: cat.description,
          is_active: true
        });
        categories.push(category);
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Categories seeded.')}`);
    }

    // Seed brands
    const brandsCount = await Brand.count();
    if (brandsCount >= BRAND_LIST.length) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of brands already exist, skipping seeding for brands.')}`);
      brands = await Brand.findAll();
    } else {
      for (const br of BRAND_LIST) {
        const brand = await Brand.create({
          name: br.name,
          description: br.description,
          is_active: true
        });
        brands.push(brand);
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Brands seeded.')}`);
    }

    // Seed products
    const productsCount = await Product.count();
    if (productsCount >= PRODUCT_LIST.length) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of products already exist, skipping seeding for products.')}`);
    } else {
      for (const prod of PRODUCT_LIST) {
        const brand = brands.find(b => b.name === prod.brand);
        const category = categories.find(c => c.name === prod.category);
        await Product.create({
          sku: Math.random().toString(36).substring(2, 10).toUpperCase(),
          name: prod.name,
          slug: prod.name.toLowerCase().replace(/\s+/g, '-'),
          description: prod.description,
          quantity: prod.quantity,
          price: prod.price,
          taxable: true,
          is_active: true,
          brand_id: brand ? brand.id : null,
          category_id: category ? category.id : null
        });
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Products seeded and associated with categories & brands.')}`);
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