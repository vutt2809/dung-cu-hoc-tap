require('dotenv').config();
const { sequelize } = require('./utils/db');
const { User, Brand, Product, Category } = require('./models');
const bcrypt = require('bcryptjs');
const { ROLES } = require('./constants');
const { faker } = require('@faker-js/faker');

async function seedDatabase() {
    try {
        console.log('🌱 Seeding database...');

        // Check if admin user exists
        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123';

        const existingAdmin = await User.findOne({ where: { email: adminEmail } });
        if (!existingAdmin) {
            console.log('Creating admin user...');
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(adminPassword, salt);

            await User.create({
                email: adminEmail,
                password: hash,
                firstName: 'Admin',
                lastName: 'User',
                role: ROLES.Admin
            });
            console.log('✅ Admin user created');
        } else {
            console.log('✅ Admin user already exists');
        }

        // Create sample categories
        const categoriesCount = await Category.count();
        if (categoriesCount < 5) {
            console.log('Creating sample categories...');
            const categories = [
                { name: 'Electronics', description: 'Electronic devices and gadgets' },
                { name: 'Clothing', description: 'Fashion and apparel' },
                { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
                { name: 'Sports', description: 'Sports equipment and accessories' },
                { name: 'Books', description: 'Books and literature' }
            ];

            for (const categoryData of categories) {
                await Category.create(categoryData);
            }
            console.log('✅ Sample categories created');
        } else {
            console.log('✅ Categories already exist');
        }

        // Create sample brands
        const brandsCount = await Brand.count();
        if (brandsCount < 5) {
            console.log('Creating sample brands...');
            const brands = [
                { name: 'TechCorp', description: 'Leading technology company' },
                { name: 'FashionStyle', description: 'Premium fashion brand' },
                { name: 'HomePlus', description: 'Quality home products' },
                { name: 'SportMax', description: 'Professional sports equipment' },
                { name: 'BookWorld', description: 'World-class publishing' }
            ];

            for (const brandData of brands) {
                await Brand.create(brandData);
            }
            console.log('✅ Sample brands created');
        } else {
            console.log('✅ Brands already exist');
        }

        // Create sample products
        const productsCount = await Product.count();
        if (productsCount < 20) {
            console.log('Creating sample products...');
            const categories = await Category.findAll();
            const brands = await Brand.findAll();

            for (let i = 0; i < 20; i++) {
                const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                const randomBrand = brands[Math.floor(Math.random() * brands.length)];

                await Product.create({
                    sku: `SKU${String(i + 1).padStart(3, '0')}`,
                    name: faker.commerce.productName(),
                    slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
                    description: faker.commerce.productDescription(),
                    quantity: faker.number.int({ min: 10, max: 100 }),
                    price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
                    taxable: faker.datatype.boolean(),
                    isActive: true,
                    brandId: randomBrand.id,
                    categoryId: randomCategory.id
                });
            }
            console.log('✅ Sample products created');
        } else {
            console.log('✅ Products already exist');
        }

        console.log('🎉 Database seeding completed!');
        console.log(`📧 Admin email: ${adminEmail}`);
        console.log(`🔑 Admin password: ${adminPassword}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
    }
}

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        // Sync database
        await sequelize.sync({ force: false });
        console.log('✅ Database synced');

        // Seed database
        await seedDatabase();

        // Set default environment variables if not present
        if (!process.env.JWT_SECRET) {
            process.env.JWT_SECRET = 'your_jwt_secret_key_here_change_in_production';
            console.log('⚠️  Using default JWT secret. Please set JWT_SECRET in production.');
        }

        // Start the server
        console.log('🚀 Starting server...');
        console.log('📝 Note: Missing email service keys are normal for development');
        require('./index.js');

    } catch (error) {
        console.error('❌ Error starting server:', error.message);
        process.exit(1);
    }
}

startServer(); 