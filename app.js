const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

// Middleware
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);


// Listen on port 5000
app.listen(5000);