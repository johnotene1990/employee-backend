const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const StaffsModel = require("./models/staffs");
const ImageModel = require("./models/image");
const bodyParser = require('body-parser');

const app = express();
app.use(express.json()); // convert user details to json format

// app.use(cors({ origin: 'http://localhost:3000' }));
// app.use(bodyParser.json());

//Enable CORS for all routes
app.use(cors({
  origin: 'https://employee-frontend-x7wh.onrender.com/', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(
  "mongodb+srv://employee:svYx4bH6zOd6sxzB@cluster0.51fq2.mongodb.net/employee?retryWrites=true&w=majority&appName=Cluster0"
);

// Uploading images in backend or server
const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: store,
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file)
  ImageModel.create({ image: req.file.filename })
    .then((image) => res.json(image))
    .catch((err) => res.json(err));
});

// how to get image details
app.get("/getImage", (req, res) => {
  ImageModel.find()
    .then((image) => res.json(image))
    .catch((err) => res.json(err));
});

// Register a user
app.post("/register", (req, res) => {
  StaffsModel.create(req.body)
    .then((staffs) => res.json(staffs))
    .catch((err) => res.json(err));
});


// Get all user details
app.get("/home", (req, res) => {
  StaffsModel.find({})
    .then((staffs) => res.json(staffs))
    .catch((err) => res.json(err));
});

// Get a single user detail
app.get("/getuser/:id", (req, res) => {
  const id = req.params.id;
  StaffsModel.findById({ _id: id })
    .then((staffs) => res.json(staffs))
    .catch((err) => res.json(err));
});


// Update single user detail
app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  StaffsModel.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    city: req.body.city,
  }, { new: true })
    .then((staffs) => res.json(staffs))
    .catch((err) => res.json(err));
});


// to get user details
app.get("/detail/:id", (req, res) => {
  const id = req.params.id;
  StaffsModel.findById({ _id: id })
    .then((staffs) => res.json(staffs))
    .catch((err) => res.json(err));
});

// delete a user
app.delete("/delete/:id", (req, res) => {
  StaffsModel.findByIdAndDelete({ _id: req.params.id })
    .then((staffs) => res.json(staffs))
    .catch((err) => res.json(err));
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await StaffsModel.findOne({ email });
    if (!user) {
      return res.json({ status: 'failure', message: 'User not found' });
    }

    if (user.password !== password) {
      return res.json({ status: 'failure', message: 'Incorrect password' });
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});

// Add a route handler for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});


// connect to server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
