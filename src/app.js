import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(router);

const PORT = 5000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
