const express = require(`express`);
const createError = require(`http-errors`);
const app = express();
const cors = require("cors");

const logger = require("./config/logger");

const httpLogger = require("./config/httpLogger");
const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");

require(`dotenv`).config();

const cookieParser = require(`cookie-parser`);
require("./config/conn");

//To which origin , you want to share your resources

app.use(httpLogger);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options(
  "*",
  cors({ origin: "*", optionsSuccessStatus: 200 })
);
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
// app.use(cors());
// app.use("/api", require("./routes"));
app.use("/", routes);

//Adding Swagger

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
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

// process.on("unhandledRejection", (error, p) => {
//   // Prints "unhandledRejection woops!"
//   logger.error("UnhandledRejection" + error.stack + "reason" + p);
//   process.exit(1);
// });
