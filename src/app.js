const express = require("express");
const DBController = require("./db/mongoose");
const cors = require("cors");
const app = express();
const Util = require("./utils/util");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "5gb",
  })
); // To parse application/x-www-form-urlencoded
app.use(require("./routes/superAdminRoutes"));
app.use(require("./routes/organisationAdminRoutes"));
app.get("/", (req, res) => {
  // Require for Load Balancer - AWS
  res.sendStatus(200);
});
app.get("/robots.txt", function (req, res) {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});

DBController.initConnection(async () => {
  const httpServer = require("http").createServer(app);
  httpServer.listen(process.env.PORT, async function () {
    console.log("Server is running on", Util.getBaseURL());
  });
});
