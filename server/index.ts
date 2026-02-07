import express, { Request, Response } from 'express';
import "dotenv/config";
import authRouter from "./src/routes/auth"
import cityRouter from "./src/routes/cityRoutes"
import regRouter from "./src/routes/registerRoutes"
import cors from "cors";
import meRouter from "./src/routes/meRoutes"


const app = express();
const PORT = 3007;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get('/api/', (req:Request, res:Response) => {
    res.send('Homepage of city-explorer.');
});


app.use("/api/auth", authRouter);
app.use("/api/city", cityRouter);
app.use("/api/auth", regRouter);
app.use("/api/me", meRouter)

app.listen(PORT, () => {
    console.log(`City-explorer is running on http://localhost:${PORT}`);
});


console.log("SERVER STARTED on port", PORT);
app.get("/health", (req, res) => res.send("ok"));
