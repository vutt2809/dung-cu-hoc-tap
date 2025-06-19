require('dotenv').config();
const { sequelize } = require('./utils/db');
const { User, Merchant, Product, Brand, Category, Order, Cart, Review, Address, Wishlist, Contact } = require('./models');

async function testDatabase() {
    try {
        console.log('Testing database connection...');

        // Test connection
        await sequelize.authenticate();
        console.log('✓ Database connection successful');

        // Test sync
        console.log('Syncing database...');
        await sequelize.sync({ force: false });
        console.log('✓ Database sync successful');

        // Test model associations
        console.log('Testing model associations...');

        // Test User model
        const testUser = await User.create({
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: 'password123',
            role: 'ROLE MEMBER'
        });
        console.log('✓ User model test successful');

        // Test Merchant model
        const testMerchant = await Merchant.create({
            name: 'Test Merchant',
            email: 'merchant@example.com',
            phoneNumber: '1234567890',
            address: 'Test Address',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'Test Country'
        });
        console.log('✓ Merchant model test successful');

        // Test Brand model
        const testBrand = await Brand.create({
            name: 'Test Brand',
            description: 'Test brand description'
        });
        console.log('✓ Brand model test successful');

        // Test Category model
        const testCategory = await Category.create({
            name: 'Test Category',
            description: 'Test category description'
        });
        console.log('✓ Category model test successful');

        // Test Product model
        const testProduct = await Product.create({
            sku: 'TEST001',
            name: 'Test Product',
            slug: 'test-product',
            description: 'Test product description',
            quantity: 10,
            price: 99.99,
            brandId: testBrand.id,
            categoryId: testCategory.id,
            merchantId: testMerchant.id
        });
        console.log('✓ Product model test successful');

        // Test associations
        const userWithOrders = await User.findByPk(testUser.id, {
            include: ['orders', 'carts', 'reviews', 'addresses', 'wishlists']
        });
        console.log('✓ User associations test successful');

        const productWithDetails = await Product.findByPk(testProduct.id, {
            include: ['brand', 'category', 'merchant', 'reviews']
        });
        console.log('✓ Product associations test successful');

        // Clean up test data
        await testProduct.destroy();
        await testCategory.destroy();
        await testBrand.destroy();
        await testMerchant.destroy();
        await testUser.destroy();

        console.log('✓ All tests passed successfully!');

    } catch (error) {
        console.error('✗ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

testDatabase(); 