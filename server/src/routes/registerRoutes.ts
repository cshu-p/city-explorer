import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, addUser } from "../services/database";

const router = Router();

export type RegisterRequest = {
    username?: string;
    password?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
};

router.post("/register", async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body as RegisterRequest;

    if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({ message: "Missing information" });
    }

    const existing = await findUserByUsername(username);
    if (existing) {
        return res.status(400).json({ message: "invalid username" });
    }


    try {
        const hash = await bcrypt.hash(password, 10);
        const id = await addUser(
            {
                username,
                password,
                email,
                firstName,
                lastName,
            },
            hash
        );
        
        const token = jwt.sign(
            { userId: id, username: username },
            process.env.JWT_SECRET || "dev_secret_change_me",
            { expiresIn: "7d" }
        );

        return res.status(201).json({ id, token });

    } catch (error) {
        res.status(500).json({ message: "Error registering" });
    }

});

export default router;
