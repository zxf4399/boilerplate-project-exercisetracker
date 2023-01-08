const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
