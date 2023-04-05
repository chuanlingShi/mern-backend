const express = require("express");

const placesControllers = require('../controllers/places-controller');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post('/', placesControllers.creatPlace);

router.patch('/:pid', placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlaceById);

module.exports = router;