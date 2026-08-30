const dotenv = require("dotenv");
dotenv.config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const connectDatabase = require("./src/model/database");
const authRoutes = require("./src/route/AuthRoute");
const accountRoute=require("./src/route/AccountRoute")
require("./src/middleware/passportMiddleware");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Aapka React frontend URL
    credentials: true, // Allow cookies / sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
connectDatabase();
app.use("/api/auth", authRoutes);
app.use("/api/account",accountRoute );
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
