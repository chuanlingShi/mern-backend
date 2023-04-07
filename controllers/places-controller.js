const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PlACES = [
  {
    id: "p1",
    title: "Franklin Field",
    description:
      "Opened in 1895 & rebuilt in 1922, this 52,593-seat venue hosts football, lacrosse & track events.",
    location: {
      lat: 39.9503505,
      lng: -75.1903793,
    },
    address: "235 S 33rd St, Philadelphia, PA 19104",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch(err) {
    return next(new HttpError('Could not find a place.', 500));
  }

  if (!place) {
    return next(new HttpError("Could not find a place for the provided id.", 404));
  }

  res.json({ place: place.toObject( {getters: true} ) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(new HttpError("Fetching places failed, please try again later.", 500));
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true }))
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
    creator
  });

  try {
    await createdPlace.save();
  } catch(err) {
    return next(new HttpError('Creating place failed.', 500));
  }

  res.status(201).json({ place: createdPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  if (!DUMMY_PlACES.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place.", 404);
  }

  DUMMY_PlACES = DUMMY_PlACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  //a copy
  const updatedPlace = { ...DUMMY_PlACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PlACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PlACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.creatPlace = creatPlace;
exports.deletePlaceById = deletePlaceById;
exports.updatePlace = updatePlace;
