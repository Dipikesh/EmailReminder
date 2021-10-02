const express = require(`express`);
const createError = require(`http-errors`);
const cors = require("cors");
const helmet = require("helmet");
require(`dotenv`).config();
const app = express();
const logger = require("./config/logger");
const httpLogger  = require("./config/httpLogger");
const route = require('./routes')
const cookieParser = require(`cookie-parser`);
require("./config/conn");

app.use(httpLogger);
app.use(helmet());

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", route);

//Adding Swagger

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use(async (err, req, res, next) => {
  const errorType = createError.isHttpError(err);
  if (!errorType) {
    logger.error(`Programatic Error, Shutting down due to ${err.stack}`);
    process.exit(1);
  }

  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server is runnin on port ${PORT}`);
});

process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});

process.on("unhandledRejection", (error, p) => {
  // Prints "unhandledRejection woops!"
  logger.error('UnhandledRejection' + error.stack + "reason" + p);
  process.exit(1);
});
