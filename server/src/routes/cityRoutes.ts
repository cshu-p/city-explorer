import { Router } from "express";
import { getCityByID } from "../services/database";

const router = Router();

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid city id" });
    }

    try {
        const city = await getCityByID(id);
        if (city) {
            res.status(200).json(city);
        } else {
            res.status(404).json({ message: `No city found with ID ${id}` });
        } 
    } catch (error) {
        res.status(500).json({ message: "Error fetching city" });
    }
});

export default router;
