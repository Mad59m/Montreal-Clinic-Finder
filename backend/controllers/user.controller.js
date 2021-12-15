const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Place = db.place;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(201).send({ message: "User created" });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  });
};

exports.addToFavorite = (req, res) => {
  placeId = req.body.placeId;
  if (!placeId) {
    res.status(400).send({ message: "Missing placeId" });
    return;
  }

  User.findOne({
    _id: req.userId,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const place = new Place({
      place_id: placeId,
    });

    place.save((err, place) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      user.places.push(place);
      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    });
  });
  res.status(201).send({ message: "Place added" });
};

exports.getFavorites = (req, res) => {
  User.findOne({
    _id: req.userId,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    Place.find(
      {
        _id: { $in: [user.places] },
      },
      function (err, places) {
        res.status(200).send(places.map((x) => x.place_id));
      }
    );
  });
};
