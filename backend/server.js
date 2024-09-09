const express = require("express");
const cors = require("cors");

const gameUserRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

app.use("/users", gameUserRoutes);
app.use("/games", gameRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "route does not exist" });
});
