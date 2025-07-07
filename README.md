# MERN Ecommerce with MySQL

A full-stack ecommerce application built with MERN stack (MongoDB → MySQL, Express.js, React.js, Node.js).

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for products with image upload
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Create, track, and manage orders
- **User Reviews**: Product rating and review system
- **Wishlist**: Save favorite products
- **Address Management**: Multiple shipping addresses
- **Admin Dashboard**: Complete admin panel for managing the store
- **Real-time Notifications**: Socket.io integration
- **Payment Integration**: Ready for payment gateway integration
- **Email Notifications**: Mailgun integration
- **Newsletter**: Mailchimp integration

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database (migrated from MongoDB)
- **Sequelize** - ORM for MySQL
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File upload handling
- **AWS S3** - Image storage
- **Mailgun** - Email service
- **Mailchimp** - Newsletter service

### Frontend
- **React.js** - Frontend framework
- **Redux** - State management
- **SCSS** - Styling
- **Webpack** - Module bundler

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Docker (optional)

## Installation

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd mern-ecommerce
```

2. Start the application:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- MySQL: localhost:3306

### Option 2: Manual Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mern-ecommerce
```

2. Install server dependencies:
```bash
cd server
yarn install
```

3. Install client dependencies:
```bash
cd ../client
yarn install
```

4. Set up MySQL database:
```sql
CREATE DATABASE school_supplies;
```

5. Configure environment variables:
Create a `.env` file in the server directory:
```env
PORT=3000
BASE_API_URL=api
CLIENT_URL=http://localhost:8080
JWT_SECRET=your_jwt_secret_here
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=school_supplies
```

6. Start the server:
```bash
cd server
yarn dev
```

7. Start the client:
```bash
cd client
yarn start
```

## Database Migration

This project has been migrated from MongoDB to MySQL. The migration includes:

- **Models**: All Mongoose schemas converted to Sequelize models
- **Relationships**: Proper foreign key relationships between tables
- **Queries**: MongoDB queries converted to SQL queries using Sequelize
- **Data Types**: MongoDB ObjectId converted to MySQL INTEGER with auto-increment

### Database Schema

The MySQL database includes the following tables:
- `users` - User accounts and authentication
- `products` - Product catalog
- `brands` - Product brands
- `categories` - Product categories
- `orders` - Customer orders
- `carts` - Shopping cart items
- `reviews` - Product reviews
- `addresses` - User addresses
- `wishlists` - User wishlists
- `contacts` - Contact form submissions

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot` - Forgot password

### Products
- `GET /api/products/list` - Get products with filters
- `GET /api/products/item/:slug` - Get product by slug
- `POST /api/products/add` - Add new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/delete/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/delete/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders/add` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Reviews
- `GET /api/reviews/list/:productId` - Get product reviews
- `POST /api/reviews/add` - Add product review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/delete/:id` - Delete review

## Default Admin Account

When you first run the application, a default admin account will be created:
- Email: admin@example.com
- Password: admin123

**Important**: Change these credentials in production!

## Environment Variables

### Server (.env)
```env
PORT=3000
BASE_API_URL=api
CLIENT_URL=http://localhost:8080
JWT_SECRET=your_jwt_secret_here
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=school_supplies

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

# Mailgun (for emails)
MAILGUN_KEY=your_mailgun_key
MAILGUN_DOMAIN=your_mailgun_domain
MAILGUN_EMAIL_SENDER=your_email

# Mailchimp (for newsletter)
MAILCHIMP_KEY=your_mailchimp_key
MAILCHIMP_LIST_KEY=your_mailchimp_list_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url

# Facebook OAuth
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_CALLBACK_URL=your_facebook_callback_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Description

An ecommerce store built with MERN stack, and utilizes third party API's. This ecommerce store enable three main different flows or implementations:

1. Buyers browse the store categories, products and brands
3. Admins manage and control the entire store components 

### Features:

  * Node provides the backend environment for this application
  * Express middleware is used to handle requests, routes
  * Mongoose schemas to model the application data
  * React for displaying UI components
  * Redux to manage application's state
  * Redux Thunk middleware to handle asynchronous redux actions

## Demo

This application is deployed on Vercel Please check it out :smile: [here](https://mern-store-gold.vercel.app).

See admin dashboard [demo](https://mernstore-bucket.s3.us-east-2.amazonaws.com/admin.mp4)

## Docker Guide

To run this project locally you can use docker compose provided in the repository. Here is a guide on how to run this project locally using docker compose.

Clone the repository
```
git clone https://github.com/mohamedsamara/mern-ecommerce.git
```

Edit the dockercompose.yml file and update the the values for MONGO_URI and JWT_SECRET

Then simply start the docker compose:

```
docker-compose build
docker-compose up
```

## Database Seed

* The seed command will create an admin user in the database
* The email and password are passed with the command as arguments
* Like below command, replace brackets with email and password. 
* For more information, see code [here](server/utils/seed.js)

```
npm run seed:db [email-***@****.com] [password-******] // This is just an example.
```

## Install

`npm install` in the project root will install dependencies in both `client` and `server`. [See package.json](package.json)

Some basic Git commands are:

```
git clone https://github.com/mohamedsamara/mern-ecommerce.git
cd project
npm install
```

## ENV

Create `.env` file for both client and server. See examples:

[Frontend ENV](client/.env.example)

[Backend ENV](server/.env.example)


## Vercel Deployment

Both frontend and backend are deployed on Vercel from the same repository. When deploying on Vercel, make sure to specifiy the root directory as `client` and `server` when importing the repository. See [client vercel.json](client/vercel.json) and [server vercel.json](server/vercel.json).

## Start development

```
npm run dev
```

## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [React](https://reactjs.org/)

- [Webpack](https://webpack.js.org/)


### Code Formatter

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippet:  

```json

    {
      "editor.formatOnSave": true,
      "prettier.singleQuote": true,
      "prettier.arrowParens": "avoid",
      "prettier.jsxSingleQuote": true,
      "prettier.trailingComma": "none",
      "javascript.preferences.quoteStyle": "single",
    }

```

