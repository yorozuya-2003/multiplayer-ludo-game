const express = require("express");

const gameUserRoutes = require("./routes/gameUserRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

app.use("/game-users", gameUserRoutes);
app.use("/games", gameRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "route does not exist" });
});
