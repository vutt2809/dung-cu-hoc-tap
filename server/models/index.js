const User = require('./user');
const Merchant = require('./merchant');
const Product = require('./product');
const Brand = require('./brand');
const Category = require('./category');
const Order = require('./order');
const Cart = require('./cart');
const Review = require('./review');
const Address = require('./address');
const Wishlist = require('./wishlist');
const Contact = require('./contact');

// User associations
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
User.hasMany(Cart, { foreignKey: 'user_id', as: 'carts' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlists' });
User.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant associations
Merchant.hasMany(User, { foreignKey: 'merchant_id', as: 'users' });
Merchant.hasMany(Product, { foreignKey: 'merchant_id', as: 'products' });

// Product associations
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Product.hasMany(Cart, { foreignKey: 'product_id', as: 'carts' });
Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlists' });

// Brand associations
Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });

// Category associations
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parent_id', as: 'children' });

// Order associations
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Review associations
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Address associations
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
    User,
    Merchant,
    Product,
    Brand,
    Category,
    Order,
    Cart,
    Review,
    Address,
    Wishlist,
    Contact
}; 