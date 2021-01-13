const express = require("express"),
  path = require("path");

const port = process.env.PORT || 8000;
const app = express();

app.use(express.static("dist"));

app.get("*", (req, res) => { // lgtm [js/missing-rate-limiting]
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log("Listening on port", port, "...");
});
