const uuid = require("uuid/v4");

const HttpError = require("../models/http-error");

const DUMMY_PlACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PlACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ place }); // {place: place}
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PlACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  res.json({ place });
};

//or function getPlaceById() {...}
//or const getPlaceById = function() {..}

const creatPlace = (req, res, next) => {
  const { title, description, location, address, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title: title,
    description: description,
    location: location,
    address: address,
    creator: creator,
  };

  DUMMY_PlACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.creatPlace = creatPlace;
