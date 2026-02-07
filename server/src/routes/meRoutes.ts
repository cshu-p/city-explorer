import { Router } from "express";
import { findUserByUserID, updateUserByID } from "../services/database";
import { authMiddleware } from "../middleware/auth_middleware";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const userid = req.user!.userId;

  const dbUser = await findUserByUserID(userid);
  if (!dbUser) return res.status(404).json({ message: "User not found" });
  // console.log("dbUser:", dbUser);
  // console.log("firstName:", dbUser.firstName, "lastName:", dbUser.lastName);

  return res.json({
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
  });
});

router.patch("/", authMiddleware, async (req, res) => {
  const userId = req.user!.userId;
  const { firstName, lastName } = req.body as {
    firstName?: string;
    lastName?: string;
  };


  const patch: { firstName?: string; lastName?: string } = {};
  if (typeof firstName === "string") patch.firstName = firstName;
  if (typeof lastName === "string") patch.lastName = lastName;

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  const updated = await updateUserByID(userId, patch);
  if (!updated) return res.status(404).json({ message: "User not found" });

  return res.json(updated);
});

export default router;
