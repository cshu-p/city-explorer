import { Router } from "express";
import { getCityByID, findCityByRegionName } from "../services/database";

const router = Router();

router.get("/", async (req, res) => {
    try {
      const regionName = req.query.regionName?.toString().trim();
  
      if (!regionName) {
        return res.status(400).json({ message: "regionName is required" });
      }
  
      const city = await findCityByRegionName(regionName);
  
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
  
      return res.json(city);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });


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
