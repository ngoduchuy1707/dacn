const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const configKey = require("./config/config-key");
const cinemaController = require("./controllers/cinema.controller");
const movieController = require("./controllers/movie.controller");
const userController = require("./controllers/user.controller");
const theatersController = require("./controllers/theaters.controller");
const adminController = require("./controllers/admin.controller");
const categoryController = require("./controllers/category.controller");
const billController = require("./controllers/bill.controller");
const ticketController = require("./controllers/ticket.controller");
//const tixController = require("./controllers/tix.controller");
const foodController = require("./controllers/food.controller");
const sessionController = require("./controllers/session.controller");
const payController = require("./controllers/pay.controller");
//

mongoose.connect(configKey.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connect to Database successfully"))
  .catch(console.log);

const app = express();
app.use(cors());

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
//passport
require("./middlewares/passport/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/images", express.static("images"));

app.use("/api", cinemaController);
app.use("/api", movieController);
app.use("/api/users", userController);
app.use("/api", theatersController);
app.use("/api/admin", adminController);
app.use("/api", categoryController);
app.use("/api", billController);
app.use("/api", ticketController);
//app.use("/api", tixController);
app.use("/api", foodController);
app.use("/api", sessionController);
app.use("/api", payController);

const port = process.env.PORT || 7000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
