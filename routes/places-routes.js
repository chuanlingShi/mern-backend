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
    creator: "u1"
  },
];

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PlACES.find(p => {
        return p.id === placeId;
    });

    res.json({place}); // {place: place}
})

module.exports = router;