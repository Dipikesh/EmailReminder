const mongoose = require("mongoose");
const logger = require("./logger");
require(`dotenv`).config();

const connect = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true
  })
  .then(() => {
    logger.info(`Mongoose server listening`);
  })
  .catch((err) => {
    logger.error(`Can not Connect ${err}`);
  });

var db = mongoose.connection;

db.on('disconnected', () => {
  logger.info('Mongoose connection is disconnected.')
})

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connect;
