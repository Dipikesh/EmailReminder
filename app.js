const express = require(`express`);
const createError = require(`http-errors`);
const cors = require("cors");
const helmet = require("helmet");
require(`dotenv`).config();
const app = express();




app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes"));

//Adding Swagger


app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use(async (err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
});

const PORT =  process.env.PORT || 8000
const server = app.listen(PORT, () => {
 console.log("Server is runnin on port 8000");
});

module.exports = server;