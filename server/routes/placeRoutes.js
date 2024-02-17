const placeRouter = require("express").Router();
const userPlace = require("../models/userPlace.js");
const moment = require("moment");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

//for random names of image
const { nanoid } = require("nanoid");

let resultHandler = function (err) {
  if (err) {
    console.log("unlink failed", err);
  } else {
    console.log("file deleted");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, "./uploads/");
  },
  filename: function (req, file, callBack) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    callBack(null, nanoid() + "." + extension);
  },
});
const upload = multer({ storage: storage });

//for getting all places
placeRouter.get("/", (req, res) => {
  let places = [];
  userPlace
    .find()
    .then((userplace) => {
      userplace.forEach((user) => {
        user.place.forEach((p) => places.push(p));
      });
      res.send(places);
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.status(400).send("Error: " + err);
    });
});

//for getting user specific places
placeRouter.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  let places = [];

  userPlace
    .findOne({ userId })
    .then((doc) => {
      if (doc) {
        doc.place.forEach((p) => places.push(p));
      }
      res.send(places);
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.status(400).send("Error: " + err);
    });
});

//for posting new place
placeRouter.post("/:userId", upload.single("file"), (req, res) => {
  // if file is not uploded in ./uploads
  if (!req.file) {
    res.send("please upload file");
  }
  console.log("Post Request: ", { ...req.body, file: req.file });
  const userId = req.params.userId;
  const image_path = req.file.path.substr(8);
  const bitmap = fs.readFileSync(path.join("./uploads/" + image_path));
  const img = new Buffer.from(bitmap).toString("base64");
  const obj = {
    location: req.body.location,
    about: req.body.about,
    lat: req.body.lat,
    lng: req.body.lng,
    date: moment().format("h:mma DD-MM-YY"),
    image_path: image_path,
    img: img,
  };

  userPlace
    .findOne({ userId })
    .then((doc) => {
      if (doc) {
        doc.place.push(obj);
        doc
          .save()
          .then((d) => {
            fs.unlink(`./uploads/${image_path}`, resultHandler);
            res.send(d.place[d.place.length - 1]);
          })
          .catch((err) => {
            console.log("Error: " + err);
            res.status(400).send("Error: " + err);
          });
      } else {
        //creting userPlace for new user
        const newUserplace = new userPlace({
          userId: userId,
          place: obj,
        });
        newUserplace
          .save()
          .then((d) => {
            fs.unlink(`./uploads/${image_path}`, resultHandler);
            res.send(d.place[d.place.length - 1]);
          })
          .catch((err) => {
            console.log("Error: " + err);
            res.status(400).send("Error: " + err);
          });
      }
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.status(400).send("Error: " + err);
    });
});

//for deleting place for user specific
placeRouter.delete("/:userId", (req, res) => {
  userPlace
    .findOne({ userId: req.params.userId })
    .then((doc) => {
      doc.place.pull({ _id: req.body._id });
      doc
        .save()
        .then(() => {
          fs.unlink(`./uploads/${req.body.image_path}`, resultHandler);
          res.send("file deleted");
        })
        .catch((err) => {
          console.log("Error: " + err);
          res.status(400).send("Error: " + err);
        });
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.status(400).send("Error: " + err);
    });
});

//for updating place content not image
placeRouter.put("/:userId", (req, res) => {
  const date = moment().format("h:mma DD-MM-YY");
  const query = {
    userId: `${req.params.userId}`,
    "place._id": `${req.body._id}`,
  };
  const updateDocument = {
    $set: {
      "place.$.lat": `${req.body.lat}`,
      "place.$.lng": `${req.body.lng}`,
      "place.$.about": `${req.body.about}`,
      "place.$.location": `${req.body.location}`,
      "place.$.date": `${date}`,
    },
  };

  userPlace
    .updateOne(query, updateDocument)
    .then((result) => {
      res.send("updated!");
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.status(400).send("Error: " + err);
    });
});

//for updating place with image as well
placeRouter.put("/:userId/file", upload.single("file"), (req, res) => {
  const date = moment().format("h:mma DD-MM-YY");

  // convert image to base64 buffer
  const bitmap = fs.readFileSync(path.join("./uploads/" + req.file.filename));
  const img = new Buffer.from(bitmap).toString("base64");
  const query = {
    userId: `${req.params.userId}`,
    "place._id": `${req.body._id}`,
  };
  const updateDocument = {
    $set: {
      "place.$.image_path": `${req.file.filename}`,
      "place.$.lat": `${req.body.lat}`,
      "place.$.lng": `${req.body.lng}`,
      "place.$.about": `${req.body.about}`,
      "place.$.location": `${req.body.location}`,
      "place.$.date": `${date}`,
      "place.$.img": `${img}`,
    },
  };

  userPlace
    .updateOne(query, updateDocument)
    .then((result) => {
      userPlace.findOne({ "place._id": req.body._id }).then((response) => {
        console.log(response.place[0]);
        fs.unlink(`./uploads/${req.file.filename}`, resultHandler);
        res.send(response.place[0]);
      });
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.status(400).send("Error: " + err);
    });
});

module.exports = placeRouter;
