import express from "express";

const app = express();

const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is working")
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
