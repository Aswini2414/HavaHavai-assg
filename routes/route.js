const express = require("express");
const airports = require("../models/airport");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const fs1 = require("fs").promises;
const cloudinary = require("../helper/cloudinaryconfig");
const terminals = require("../models/terminals");
const services = require("../models/services");

const dirname1 = path.resolve();
const imagesDir = path.join(dirname1, "images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    cb(null, date + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/all-terminals", async (req, res) => {
  try {
    const all_terminals = await terminals.find();
    res.status(200).json(all_terminals);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/add-terminal", upload.single("file"), async (req, res) => {
  try {
    const imageFile = req.file;
    const { title, desc } = req.body;

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    console.log(imageResult.secure_url);
    const terminaldata = await new terminals({
      title: title,
      desc: desc,
      image: imageResult.secure_url,
    });
    await terminaldata.save();
    const completeData = await terminals.find();
      res.status(200).json(completeData);
      
      const filesInImagesDir = await fs1.readdir(imagesDir);
      for (let i = 0; i < filesInImagesDir.length; i++) {
        fs.unlink(path.join(imagesDir, filesInImagesDir[i]), (err) => {
          if (err) {
            throw err;
          }
          console.log("Images directory is cleared");
        });
      }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/save", async (req, res) => {
  try {
    const { name, country, code, terminals } = req.body;
    console.log(name, country);

    if (!name || !country || !code || !terminals) {
      res.status(400).json({ message: "Please provide all the details" });
    }

    const preData = await airports.findOne({ code });

    if (preData) {
      res.status(400).json({ message: "Airport already exists" });
    }

    const newData = await airports.create({ name, country, code, terminals });
    await newData.save();
    const completeData = await airports.find();
    res.status(201).json(completeData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const completeData = await airports.find();
    res.status(200).json(completeData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/update", async (req, res) => {
  try {
    const { name, country, code, terminals } = req.body;
    console.log(name, country);

    if (!name || !country || !code || !terminals) {
      res.status(400).json({ message: "Please provide all the details" });
    }

    const preData = await airports.findOne({ code });
    if (preData) {
      const updateData = await airports.findByIdAndUpdate(
        { _id: preData._id },
        { name, country, code, terminals }
      );
      await updateData.save();
      const completeData = await airports.find();
      res.status(200).json(completeData);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/airport/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await airports.deleteOne({ _id: id });
    const completeData = await airports.find();
    res.status(200).json(completeData);
  } catch (error) {
    res.status(400).json(error);
  }
});


router.post("/add-service", upload.single("file"), async (req, res) => {
    try {
      const imageFile = req.file;
      const {name,category,subcategory,desc} = req.body;

        console.log(imageFile, name, category, subcategory, desc);
      const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      console.log(imageResult.secure_url);
      const servicedata = await new services({
          name: name,
          category: category,
          subcategory:subcategory,
        desc: desc,
        image: imageResult.secure_url,
      });
      await servicedata.save();
      const completeData = await services.find();
      res.status(200).json(completeData);

      const filesInImagesDir = await fs1.readdir(imagesDir);
      for (let i = 0; i < filesInImagesDir.length; i++) {
        fs.unlink(path.join(imagesDir, filesInImagesDir[i]), (err) => {
          if (err) {
            throw err;
          }
          console.log("Images directory is cleared");
        });
      }
    } catch (error) {
      res.status(400).json(error);
    }
})

module.exports = router;
