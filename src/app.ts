import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import matchRoutes from "./routes/matchRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/matches",matchRoutes);

export default app;
