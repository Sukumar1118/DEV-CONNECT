const express = require("express");
const DBConnect = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateUserSignUpData } = require("./utils/user.utils");
const bcrypt = require("bcrypt");

DBConnect()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error while connecting to database", err);
  });

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validateUserSignUpData(req.body);
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.email;
  try {
    const user = await User.findOne({ email: emailId });
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const AllowedUpdates = ["age", "password", "skills", "about", "photoUrl"];
    const updates = Object.keys(req.body).every((update) => {
      return AllowedUpdates.includes(update);
    });
    if (!updates) {
      throw new Error("Invalid updates");
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // new: true returns the updated document
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Update not allowed - " + error);
  }
});
