import express from "express";
import matchRouter from "./routes/matches.js";
import { createServer } from "node:http"
import { attachWebSocketServer } from "./ws/server.js";

const app = express();
const server = createServer(app);


const port = 8000;
const host = '0.0.0.0'

app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is working")
})

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(port, host, () => {
    const baseUrl = host === '0.0.0.0' ? `http://localhost:${port}` : `http://${host}:${port}`;
    console.log(`server running on ${baseUrl}`);
    console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
})