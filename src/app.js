const express = require("express");
const DBController = require("./db/mongoose");
// const S3 = require("./storage/cms"); //use storage if not S3
const cors = require("cors");
const app = express();
// const cron = require("node-cron");
const Util = require("./utils/util");

app.use(cors());
// app.use(
//   express.urlencoded({ extended: false, limit: "5gb", parameterLimit: 50000 })
// ); // To parse application/json
app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    limit: "5gb",
  })
); // To parse application/x-www-form-urlencoded
// app.use(require("./routes/adminRoute"));
// app.use(require("./routes/defaultRoute"));
// app.use(require("./routes/collegeRoutes"));
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
