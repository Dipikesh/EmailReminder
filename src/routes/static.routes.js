const router = require("express").Router();
const path = require("path");


router.get('/register', (req, res) => {
    console.log("dirName",__dirname);
    res.sendFile(path.join(__dirname + '../' + '../'+'../'+'/public/pages/register.html'));
    // res.send("okay");
})


router.get("/otp", (req, res) => {
  console.log("dirName", __dirname);
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/pages/otp.html")
  );
  // res.send("okay");
});

router.get("/home", (req, res) => {
  console.log("dirName", __dirname);
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/pages/home.html")
  );
  // res.send("okay");
});

router.get("/login", (req, res) => {
  console.log("dirName", __dirname);
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/pages/login.html")
  );
  // res.send("okay");
});


router.get('/static/css', (req, res) => {
    res.sendFile(
      path.join(
        __dirname + "../" + "../" + "../" + "/public/css/login.css"
      )
    );
})

router.get("/static/css/home", (req, res) => {
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/css/home.css")
  );
});



router.get("/static/js/register", (req, res) => {
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/js/register.js")
  );
});

router.get("/static/js/login", (req, res) => {
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/js/login.js")
  );
});

router.get("/static/js/otp", (req, res) => {
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/js/otp.js")
  );
});

router.get("/static/js/home", (req, res) => {
  res.sendFile(
    path.join(__dirname + "../" + "../" + "../" + "/public/js/home.js")
  );
});


module.exports = router;