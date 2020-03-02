const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

// Middleware
app.use(placesRoutes);


// Listen on port 5000
app.listen(5000);