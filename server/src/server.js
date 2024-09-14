const app = require("./app");
const connectDataBase = require("./config/db");
const logger = require("./controllers/loggerController");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  logger.log("info", `server is running at http://localhost:${serverPort}`);
  await connectDataBase();
});
