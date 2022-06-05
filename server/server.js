import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { user } from "./models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const PORT = process.env.PORT || 8000;

// middleware

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => console.log("sucessfully connected to database"))
  .catch((error) => console.log(error.message));

app.get("/", (req, res) => {
  res.json("hello world");
});
app.post("/api/register", async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.username);
    console.log(req.body);
    const User = await new user({
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
    });
    await User.save();
    res.status(200).json({ user: User });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const User = await user.findOne({
      email: req.body.email,
    });

    if (!User) {
      return res.json({ status: "error", error: "invalid login" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      User.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: User.name,
          email: User.email,
        },
        "secret123"
      );
      res.status(201).json({ user: token });
    } else {
      res.status(200).json({ user: false });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/api/quote", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;

    const User = await user.findOne({ email: email });

    return res.json({ status: "ok", quote: User.quote });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/api/quote", async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;

    await user.update({ email: email }, { $set: { quote: req.body.quote } });

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
