const express = require("express");
const DBConnect = require("./config/database");
const app = express();
const User = require("./models/user");

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
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }); // new: true returns the updated document
    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.send(500).send(error);
  }
});
