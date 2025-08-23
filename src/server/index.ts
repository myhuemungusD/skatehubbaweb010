import path from "path";
import express from "express";

const app = express();
app.use(express.static(path.join(__dirname, "..", "client"))); // if you copy client build here
app.get("/health", (_req, res) => res.send("ok"));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => console.log("server on", port));