const uuid = require("uuid/v4");

const HttpError = require("../models/http-error");

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

const deletePlaceById = (req, res, next) => {
  
  const placeId = req.params.pid;
  DUMMY_PlACES = DUMMY_PlACES.filter(p => p.id !== placeId);
  res.status(200).json({ message: 'Deleted place.' });
}

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  //a copy
  const updatedPlace = {...DUMMY_PlACES.find(p => p.id === placeId)};
  const placeIndex = DUMMY_PlACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  
  DUMMY_PlACES[placeIndex] = updatedPlace;

  res.status(200).json({place: updatedPlace});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.creatPlace = creatPlace;
exports.deletePlaceById = deletePlaceById;
exports.updatePlace = updatePlace;
