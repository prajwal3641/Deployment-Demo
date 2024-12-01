const express = require("express");
const app = express();

const session = require("express-session");
const passport = require("passport");
const localstrategy = require("passport-local").Strategy;

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

authUser = (user, password, done) => {
  console.log(`Value of "user" is ${user}`);
  console.log(`Valuey of "password" is ${password}`);

  let authenticated_user = {
    id: 123,
    name: "prajwal",
  };

  return done(null, authenticated_user);
};

passport.use(new localstrategy(authUser));

passport.serializeUser((user, done) => {
  console.log("serialize user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  console.log("deserialize the user");
  console.log(user.id);
  done(null, { name: "prajwal", id: 123 });
});

let count = 1;
printData = (req, res, next) => {
  console.log(`req.body.username -- > ${req.body.username}`);
  console.log(`req.body.password -- > ${req.body.password}`);
  next();
};

app.use(printData);
app.listen(3001, () => {
  console.log("Server started at 3001");
});

app.get("/login", (req, res) => {
  // this shouled be in the views

  res.render("login.ejs");
});
app.get("/", (req, res) => {
  res.send("Welcome to my Node.js app!");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

app.get("/dashboard", (req, res) => {
  res.render("dashboard.ejs", { name: req.body.name });
});
