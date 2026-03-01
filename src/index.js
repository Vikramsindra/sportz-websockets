import express from "express";
import matchRouter from "./routes/matches.js";
import { createServer } from "node:http"
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.js";

const app = express();
const server = createServer(app);


const port = 8000;
const host = '0.0.0.0'

app.use(express.json());
app.use(securityMiddleware());

app.get("/", (req, res) => {
    res.send("server is working")
});

app.use("/matches", matchRouter);
app.use("/matches/:id/commentary", commentaryRouter);

const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(port, host, () => {
    const baseUrl = host === '0.0.0.0' ? `http://localhost:${port}` : `http://${host}:${port}`;
    console.log(`server running on ${baseUrl}`);
    console.log(`WebSocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`);
})