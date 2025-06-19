# MERN Ecommerce Server - MySQL Version

This is the server-side of the MERN Ecommerce application, migrated from MongoDB to MySQL using Sequelize ORM.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL 8.0
- Docker (optional, for containerized setup)

### Database Setup

#### Option 1: Using Docker (Recommended)
```bash
# Start MySQL container
cd ..
docker-compose up -d mysql

# The database will be available at:
# Host: localhost
# Port: 3306
# Username: root
# Password: password
# Database: mern_ecommerce
```

#### Option 2: Local MySQL Installation
1. Install MySQL 8.0
2. Create a database named `mern_ecommerce`
3. Update the database configuration in `config/keys.js` if needed

### Installation

```bash
# Install dependencies
npm install

# Test database connection
npm run test:db

# Run full system test
npm run test:full

# Start server with seed data
npm run start:seed

# Or start server normally
npm run dev
```

## 📊 Database Schema

### Models
- **User**: Authentication and user management
- **Merchant**: Store/seller information
- **Product**: Product catalog
- **Brand**: Product brands
- **Category**: Product categories
- **Order**: Customer orders
- **Cart**: Shopping cart items
- **Review**: Product reviews
- **Address**: User addresses
- **Wishlist**: User wishlists
- **Contact**: Contact form submissions

### Key Relationships
- User belongs to Merchant (optional)
- Product belongs to Brand, Category, and Merchant
- Order belongs to User
- Cart items belong to User and Product
- Reviews belong to User and Product
- Addresses belong to User
- Wishlist items belong to User and Product

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the server directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=mern_ecommerce

# Server Configuration
PORT=3000
BASE_API_URL=api
CLIENT_URL=http://localhost:8080

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Optional: Email Services
MAILCHIMP_KEY=
MAILCHIMP_LIST_KEY=
MAILGUN_KEY=
MAILGUN_DOMAIN=
MAILGUN_EMAIL_SENDER=

# Optional: OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=

# Optional: AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

## 🧪 Testing

### Database Tests
```bash
# Test basic database connection and sync
npm run test:db

# Test full system functionality
npm run test:full
```

### API Testing
The server includes comprehensive API endpoints for:
- Authentication (login, register, forgot password)
- Product management
- Cart operations
- Order processing
- User management
- Review system
- Address management
- Wishlist functionality

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot` - Forgot password
- `POST /api/auth/reset` - Reset password

### Products
- `GET /api/product/list` - Get products with filters
- `GET /api/product/item/:slug` - Get product by slug
- `POST /api/product/add` - Add new product (Admin/Merchant)
- `PUT /api/product/:id` - Update product (Admin/Merchant)
- `DELETE /api/product/:id` - Delete product (Admin/Merchant)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `GET /api/order` - Get user orders
- `POST /api/order/add` - Create new order
- `GET /api/order/:id` - Get order details

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/address` - Get user addresses
- `POST /api/user/address` - Add new address

## 🔄 Migration from MongoDB

This project has been successfully migrated from MongoDB/Mongoose to MySQL/Sequelize:

### Changes Made
1. **Database**: MongoDB → MySQL
2. **ORM**: Mongoose → Sequelize
3. **Models**: Converted all Mongoose schemas to Sequelize models
4. **Queries**: Updated all database queries to use Sequelize syntax
5. **Associations**: Implemented proper Sequelize associations
6. **Configuration**: Updated database configuration and connection setup

### Key Benefits
- **ACID Compliance**: MySQL provides better data consistency
- **Performance**: Optimized queries and indexing
- **Scalability**: Better horizontal scaling capabilities
- **Ecosystem**: Rich MySQL ecosystem and tools
- **Cost**: More cost-effective for production deployments

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
cd ..
docker-compose up --build
```

### Manual Deployment
```bash
# Install dependencies
npm install

# Set environment variables
# Create .env file with production values

# Start production server
npm start
```

## 📚 Additional Resources

- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 