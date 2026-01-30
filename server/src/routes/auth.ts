import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername } from "../services/database";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    return res.status(400).json({ message: "username and password required" });
  }

  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    // console.log(password)
    // console.log(user.username)
    // console.log(user.password_hash)
    return res.status(401).json({ message: "invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET || "dev_secret_change_me",
    { expiresIn: "7d" }
  );

  return res.json({ token });
});

export default router;
