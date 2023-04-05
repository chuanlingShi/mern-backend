const express = require('express');

const HttpError = require('./models/http-error');

const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);

app.use((req, res, next) => {
  throw new HttpError("Cannot find this route.", 404);
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unkown error occurred!'});
});

app.listen(5000);