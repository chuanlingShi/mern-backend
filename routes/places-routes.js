const express = require("express");

const HttpError = require('../models/http-error');

const router = express.Router();

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

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PlACES.find(p => {
        return p.id === placeId;
    });

    if (!place) {
        throw new HttpError("Could not find a place for the provided id.", 404);
    } 

    res.json({place}); // {place: place}
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PlACES.find((p) => {
    return p.creator === userId;
  });

    if (!place) {
        return next(new Error(
            "Could not find a place for the provided user id.", 404
        ));
    }
  res.json({ place });
});

module.exports = router;