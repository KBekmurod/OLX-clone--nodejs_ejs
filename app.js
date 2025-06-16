require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

//Mongodb connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

//View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Static
app.set(express.static(path.join(__dirname, "public")));
//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("__method"));
app.use(morgan("dev"));
//session

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

//Global user info
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server connect on port: ${PORT}`);
});
