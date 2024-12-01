const express = require("express");
const app = express();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Authentication logic
const authUser = (username, password, done) => {
  console.log(`Value of "username" is ${username}`);
  console.log(`Value of "password" is ${password}`);

  if (username === "prajwal" && password === "1234") {
    const authenticatedUser = { id: 123, name: "prajwal" };
    return done(null, authenticatedUser);
  } else {
    return done(null, false, { message: "Invalid credentials" });
  }
};

// Configure passport local strategy
passport.use(new LocalStrategy(authUser));

// Serialize user to session
passport.serializeUser((user, done) => {
  console.log("serialize user");
  console.log(user);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  console.log("deserialize user");
  done(null, { name: "prajwal", id });
});

// Middleware to print request body
const printData = (req, res, next) => {
  console.log(`req.body.username -- > ${req.body.username}`);
  console.log(`req.body.password -- > ${req.body.password}`);
  next();
};

app.use(printData);

// Set view engine for rendering EJS templates
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to my Node.js app!");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard", { name: req.user.name });
  } else {
    res.redirect("/login");
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
