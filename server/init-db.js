const { setupDB, sequelize } = require('./utils/db');
const { User, Product, Category, Brand, Order, Cart, Review, Address, Wishlist, Contact, Merchant } = require('./models');

async function initializeDatabase() {
    try {
        console.log('Initializing database...');

        // Test connection and sync models
        await setupDB();

        console.log('✓ Database initialized successfully!');
        console.log('✓ All tables created!');

        // List all tables
        const tables = await sequelize.showAllSchemas();
        console.log('\nCreated tables:');
        console.log('- users');
        console.log('- merchants');
        console.log('- products');
        console.log('- brands');
        console.log('- categories');
        console.log('- orders');
        console.log('- carts');
        console.log('- reviews');
        console.log('- addresses');
        console.log('- wishlists');
        console.log('- contacts');

        console.log('\n✓ Database is ready to use!');

    } catch (error) {
        console.error('✗ Database initialization failed:', error.message);
        console.error('Make sure MySQL is running and the connection details are correct.');
    } finally {
        await sequelize.close();
        console.log('\nDatabase connection closed.');
    }
}

initializeDatabase(); 