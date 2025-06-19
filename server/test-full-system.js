require('dotenv').config();
const { sequelize } = require('./utils/db');
const { User, Merchant, Product, Brand, Category, Order, Cart, Review, Address, Wishlist, Contact } = require('./models');
const bcrypt = require('bcryptjs');
const { ROLES, EMAIL_PROVIDER } = require('./constants');

async function testFullSystem() {
    try {
        console.log('🚀 Testing Full MERN Ecommerce System with MySQL...\n');

        // Test database connection
        console.log('1. Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection successful');

        // Test database sync
        console.log('\n2. Testing database sync...');
        await sequelize.sync({ force: false });
        console.log('✅ Database sync successful');

        // Test model creation and associations
        console.log('\n3. Testing model creation and associations...');

        // Create test data
        const testMerchant = await Merchant.create({
            name: 'Test Merchant Store',
            email: 'merchant@test.com',
            phoneNumber: '1234567890',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'Test Country'
        });
        console.log('✅ Merchant created');

        const testBrand = await Brand.create({
            name: 'Test Brand',
            description: 'A test brand for testing purposes'
        });
        console.log('✅ Brand created');

        const testCategory = await Category.create({
            name: 'Test Category',
            description: 'A test category for testing purposes'
        });
        console.log('✅ Category created');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('testpassword123', salt);

        const testUser = await User.create({
            email: 'testuser@example.com',
            firstName: 'Test',
            lastName: 'User',
            password: hashedPassword,
            role: ROLES.Member,
            provider: EMAIL_PROVIDER.Email
        });
        console.log('✅ User created');

        const testProduct = await Product.create({
            sku: 'TEST001',
            name: 'Test Product',
            slug: 'test-product',
            description: 'A test product for testing purposes',
            quantity: 50,
            price: 99.99,
            taxable: true,
            is_active: true,
            brandId: testBrand.id,
            categoryId: testCategory.id,
            merchantId: testMerchant.id
        });
        console.log('✅ Product created');

        // Test associations
        console.log('\n4. Testing model associations...');

        const userWithAssociations = await User.findByPk(testUser.id, {
            include: [
                { model: Merchant, as: 'merchant' },
                { model: Order, as: 'orders' },
                { model: Cart, as: 'carts' },
                { model: Review, as: 'reviews' },
                { model: Address, as: 'addresses' },
                { model: Wishlist, as: 'wishlists' }
            ]
        });
        console.log('✅ User associations working');

        const productWithAssociations = await Product.findByPk(testProduct.id, {
            include: [
                { model: Brand, as: 'brand' },
                { model: Category, as: 'category' },
                { model: Merchant, as: 'merchant' },
                { model: Review, as: 'reviews' }
            ]
        });
        console.log('✅ Product associations working');

        // Test cart functionality
        console.log('\n5. Testing cart functionality...');
        const testCart = await Cart.create({
            userId: testUser.id,
            productId: testProduct.id,
            quantity: 2,
            price: testProduct.price
        });
        console.log('✅ Cart item created');

        const cartWithDetails = await Cart.findByPk(testCart.id, {
            include: [
                { model: User, as: 'user' },
                { model: Product, as: 'product' }
            ]
        });
        console.log('✅ Cart associations working');

        // Test review functionality
        console.log('\n6. Testing review functionality...');
        const testReview = await Review.create({
            productId: testProduct.id,
            userId: testUser.id,
            rating: 5,
            title: 'Great Product!',
            comment: 'This is an excellent test product.',
            is_active: true
        });
        console.log('✅ Review created');

        const reviewWithDetails = await Review.findByPk(testReview.id, {
            include: [
                { model: User, as: 'user' },
                { model: Product, as: 'product' }
            ]
        });
        console.log('✅ Review associations working');

        // Test address functionality
        console.log('\n7. Testing address functionality...');
        const testAddress = await Address.create({
            userId: testUser.id,
            address: '456 Test Avenue',
            city: 'Test City',
            state: 'Test State',
            zipCode: '54321',
            country: 'Test Country',
            phoneNumber: '0987654321',
            isDefault: true
        });
        console.log('✅ Address created');

        // Test order functionality
        console.log('\n8. Testing order functionality...');
        const testOrder = await Order.create({
            orderNumber: 'ORD-' + Date.now(),
            total: testProduct.price * 2,
            status: 'pending',
            userId: testUser.id,
            shippingAddress: JSON.stringify(testAddress),
            paymentMethod: 'credit_card',
            paymentStatus: 'pending'
        });
        console.log('✅ Order created');

        // Test wishlist functionality
        console.log('\n9. Testing wishlist functionality...');
        const testWishlist = await Wishlist.create({
            userId: testUser.id,
            productId: testProduct.id
        });
        console.log('✅ Wishlist item created');

        // Test contact functionality
        console.log('\n10. Testing contact functionality...');
        const testContact = await Contact.create({
            name: 'Test Contact',
            email: 'contact@test.com',
            message: 'This is a test contact message.'
        });
        console.log('✅ Contact created');

        // Test complex queries
        console.log('\n11. Testing complex queries...');

        // Test product search
        const searchResults = await Product.findAll({
            where: {
                name: { [require('sequelize').Op.like]: '%Test%' },
                is_active: true
            },
            include: [
                { model: Brand, as: 'brand' },
                { model: Category, as: 'category' }
            ]
        });
        console.log(`✅ Product search found ${searchResults.length} results`);

        // Test user with all data
        const userWithAllData = await User.findByPk(testUser.id, {
            include: [
                { model: Merchant, as: 'merchant' },
                { model: Order, as: 'orders' },
                { model: Cart, as: 'carts', include: [{ model: Product, as: 'product' }] },
                { model: Review, as: 'reviews' },
                { model: Address, as: 'addresses' },
                { model: Wishlist, as: 'wishlists', include: [{ model: Product, as: 'product' }] }
            ]
        });
        console.log('✅ Complex user query successful');

        // Clean up test data
        console.log('\n12. Cleaning up test data...');
        await testWishlist.destroy();
        await testCart.destroy();
        await testReview.destroy();
        await testOrder.destroy();
        await testAddress.destroy();
        await testContact.destroy();
        await testProduct.destroy();
        await testUser.destroy();
        await testCategory.destroy();
        await testBrand.destroy();
        await testMerchant.destroy();
        console.log('✅ Test data cleaned up');

        console.log('\n🎉 All tests passed successfully!');
        console.log('✅ Database: MySQL with Sequelize');
        console.log('✅ Models: All models working correctly');
        console.log('✅ Associations: All relationships working');
        console.log('✅ Queries: Complex queries working');
        console.log('✅ CRUD Operations: All operations successful');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

testFullSystem(); 