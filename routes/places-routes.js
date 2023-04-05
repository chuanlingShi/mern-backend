const express = require("express");

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
        const error = new Error("Could not find a place for the provided id.");
        error.code = 404;
        throw error;
    } 

    res.json({place}); // {place: place}
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PlACES.find((p) => {
    return p.creator === userId;
  });

    if (!place) {
        const error = new Error(
            "Could not find a place for the provided user id."
        );
        error.code = 404;
        return next(error);
    }
  res.json({ place });
});

module.exports = router;