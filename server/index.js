require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const helmet = require('helmet');

const keys = require('./config/keys');
const routes = require('./routes');
const socket = require('./socket');
const { setupDB } = require('./utils/db');

// Import models to ensure they are registered
require('./models');

const { port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true
  })
);
app.use(cors());

// Setup database
setupDB();
require('./config/passport')(app);
app.use(routes);

const server = app.listen(port, () => {
  console.log(`Server School Supplies is running on port ${port}`);
});

socket(server);
