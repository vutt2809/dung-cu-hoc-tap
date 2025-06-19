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
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' });
User.belongsTo(Merchant, { foreignKey: 'merchantId', as: 'merchant' });

// Merchant associations
Merchant.hasMany(User, { foreignKey: 'merchantId', as: 'users' });
Merchant.hasMany(Product, { foreignKey: 'merchantId', as: 'products' });

// Product associations
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.belongsTo(Merchant, { foreignKey: 'merchantId', as: 'merchant' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Product.hasMany(Cart, { foreignKey: 'productId', as: 'carts' });
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' });

// Brand associations
Brand.hasMany(Product, { foreignKey: 'brandId', as: 'products' });

// Category associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Address associations
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

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