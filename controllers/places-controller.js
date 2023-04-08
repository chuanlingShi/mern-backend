const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not find a place.", 500));
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError("Fetching places failed, please try again later.", 500)
    );
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

//or function getPlaceById() {...}
//or const getPlaceById = function() {..}

const creatPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input.", 422));
  }

  const { title, description, address, creator } = req.body;

  const coordinates = await getCoordsForAddress(address);

  const createdPlace = new Place({
    title,
    description,
    image:
      "https://en.wikipedia.org/wiki/Drexel_University#/media/File:Anthony_J._Drexel_by_Moses_Ezekiel_(1844-1917)_-_Drexel_University_-_IMG_7320.JPG",
    location: coordinates,
    address,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Creating place failed.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find a user.", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session });
    user.places.push(createdPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating place failed.", 500));
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(new HttpError("Deleting place failed.", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find a place for this id.", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Deleting place failed.", 500));
  }

  res.status(200).json({ message: "Deleted place." });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input.", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError("Could not find a place.", 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError("Updating place failed.", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.creatPlace = creatPlace;
exports.deletePlaceById = deletePlaceById;
exports.updatePlace = updatePlace;
