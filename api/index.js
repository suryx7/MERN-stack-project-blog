const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");


require('dotenv').config();

// // Import Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const searchRouter = require('./routes/searchRoute');

// // App Configurations
const app = express();

app.use(cors({ credentials: true, origin: 'https://analyzedbyiitians-client.onrender.com' }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// // MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// // Routes Middleware
app.use('/', userRoutes);
app.use('/post', postRoutes);
app.use('/search', searchRouter);
app.use('/send-message', searchRouter);


// // Start the server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
















// // // // useless code // // // // // // // // //  // //

// const express = require('express');
// const cors = require('cors');
// const mongoose = require("mongoose");
// const User = require('./models/User');
// const Post = require('./models/Post');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const multer = require('multer');
// const fs = require('fs');
// require('dotenv').config();
// var nodemailer = require("nodemailer");

// // Routers
// const searchRouter = require('./routes/searchRoute');

// const app = express();

// // Middleware and configurations
// const uploadMiddleware = multer({ dest: 'uploads/' });
// const salt = bcrypt.genSaltSync(10);
// const secret = process.env.JWT_SECRET;

// // Middlewares
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(express.json());
// app.use(cookieParser());
// app.use('/uploads', express.static(__dirname + '/uploads'));

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error("MongoDB connection error:", err));

// //  JWT verification
// const verifyToken = async (token) => {
//   try {
//     const info = await jwt.verify(token, secret);
//     return info;
//   } catch (err) {
//     throw err;
//   }
// };

// // Register endpoint
// app.post('/register', async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;
//     const hashedPassword = bcrypt.hashSync(password, salt);

//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     const userDoc = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json(userDoc);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Login endpoint
// app.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if the input is an email or username and search accordingly
//     let userDoc;
//     if (/\S+@\S+\.\S+/.test(username)) {
//       // If it's an email, search by email
//       userDoc = await User.findOne({ email: username });
//     } else {
//       // If it's not an email, search by username
//       userDoc = await User.findOne({ username });
//     }

//     if (!userDoc) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const passOk = bcrypt.compareSync(password, userDoc.password);
//     if (passOk) {
//       const token = jwt.sign(
//         { username: userDoc.username, email: userDoc.email, id: userDoc._id, role: userDoc.role },
//         secret, { expiresIn: '1h' }
//       );
//       res.cookie('token', token, { httpOnly: true }).json({
//         id: userDoc._id,
//         username: userDoc.username,
//         email: userDoc.email,
//         role: userDoc.role,
//       });
//     } else {
//       res.status(400).json({ error: 'Invalid credentials' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// // forgot password end point
// app.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;

//   try {
//     const oldUser = await User.findOne({ email });
//     if (!oldUser) {
//       return res.status(404).json({ error: "User with this email does not exist" });
//     }

//     const newSecret = secret + oldUser.password;
//     const resetToken = jwt.sign({ email: oldUser.email, id: oldUser._id }, newSecret, { expiresIn: "15m" });

//     const resetLink = `http://localhost:3050/reset-password/${oldUser._id}/${resetToken}`;
//     console.log(resetLink);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     var mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Reset Request",
//       text: `Click the link to reset your password: ${resetLink}`,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent" + email.info);
//       }
//     });

//     res.json({ message: "Password reset link sent to your email" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // reset password
// app.get("/reset-password/:id/:token", async (req, res) => {
//   const { id, token } = req.params;

//   try {
//     const oldUser = await User.findOne({ _id: id });
//     if (!oldUser) {
//       return res.status(404).json({ error: "User does not exist" });
//     }

//     const newSecret = secret + oldUser.password;
//     const verify = jwt.verify(token, newSecret);

//     res.status(200).json({ email: verify.email, status: "verified" });
//   } catch (err) {
//     res.status(400).json({ error: "Invalid or expired token" });
//   }
// });

// app.post("/reset-password/:id/:token", async (req, res) => {
//   const { id, token } = req.params;
//   const { newPassword } = req.body;

//   try {
//     if (newPassword.length < 8) {
//       return res.status(400).json({ error: "Password must be at least 8 characters long." });
//     }

//     const oldUser = await User.findOne({ _id: id });
//     if (!oldUser) {
//       return res.status(404).json({ error: "User does not exist" });
//     }

//     const newSecret = secret + oldUser.password;
//     jwt.verify(token, newSecret);

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await User.updateOne({ _id: id }, { $set: { password: hashedPassword } });

//     res.json({ message: "Password reset successfully. You can now log in with your new password." });
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(400).json({ error: "Token expired. Request a new password reset." });
//     }
//     res.status(400).json({ error: "Invalid or expired token." });
//   }
// });





// // Profile endpoint
// app.get('/profile', async (req, res) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({ error: 'No JWT token provided' });
//   }

//   try {
//     const userInfo = await verifyToken(token);
//     res.json(userInfo);
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// });

// // Logout endpoint
// app.post('/logout', (req, res) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({ error: 'No JWT token provided' });
//   }

//   res.cookie('token', '').json({ message: 'Logged out successfully' });
// });

// // Create post endpoint
// app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({ error: 'No JWT token provided' });
//   }

//   try {
//     const userInfo = await verifyToken(token);

//     const { originalname, path } = req.file;
//     const ext = originalname.split('.').pop();
//     const newPath = `${path}.${ext}`;
//     fs.renameSync(path, newPath);

//     const { title, courseOwner, summary, content } = req.body;
//     const postDoc = await Post.create({
//       title,
//       courseOwner,
//       summary,
//       content,
//       cover: newPath,
//       author: userInfo.id,
//     });

//     res.status(201).json(postDoc);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update post endpoint
// app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({ error: 'No JWT token provided' });
//   }

//   try {
//     const userInfo = await verifyToken(token);

//     let newPath = null;

//     if (req.file) {
//       const { originalname, path } = req.file;
//       const ext = originalname.split('.').pop();
//       newPath = `${path}.${ext}`;
//       fs.renameSync(path, newPath);
//     }

//     const { id, title, courseOwner, summary, content } = req.body;
//     const postDoc = await Post.findById(id);

//     if (!postDoc) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     if (String(postDoc.author) !== String(userInfo.id)) {
//       return res.status(403).json({ error: 'You are not the author of this post' });
//     }

//     await postDoc.updateOne({
//       title,
//       courseOwner,
//       summary,
//       content,
//       cover: newPath || postDoc.cover,
//     });

//     res.json(postDoc);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get all posts endpoint
// app.get('/post', async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate('author', ['username'])
//       .sort({ createdAt: -1 })
//       .limit(20);

//     res.json(posts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Get post by ID endpoint
// app.get('/post/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const postDoc = await Post.findById(id).populate('author', ['username']);

//     if (!postDoc) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     res.json(postDoc);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // delete post
// app.delete('/post/:id', async (req, res) => {
//   const {id} = req.params;
//   try {
//     await Post.findByIdAndDelete(id);
//     res.status(200).json({message: "Post deleted successfully"});
//   } catch (error) {
//     res.status(500).json({message: "Failed to delete post"});
//   }
// });

// // Search endpoint
// app.get('/search', async (req, res) => {
//   const { query } = req.query;

//   if (!query) {
//     return res.status(400).json({ error: 'Query parameter is required' });
//   }

//   try {
//     const posts = await Post.find({
//       $or: [
//         { title: { $regex: query, $options: 'i' } },
//         { courseOwner: { $regex: query, $options: 'i' } },
//       ],
//     });

//     res.json(posts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Start the server
// const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));


// // google facebook login

// const express = require("express");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const session = require("express-session");
// require("dotenv").config(); // For environment variables

// // const app = express();

// // Middleware for sessions
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // User serialization and deserialization
// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:4050/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log("Google Profile:", profile);
//       // Handle user creation or retrieval here
//       return done(null, profile);
//     }
//   )
// );

// // Facebook OAuth Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "http://localhost:4050/auth/facebook/callback",
//       profileFields: ["id", "displayName", "email"],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log("Facebook Profile:", profile);
//       // Handle user creation or retrieval here
//       return done(null, profile);
//     }
//   )
// );

// // Google Authentication Routes
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/success",
//     failureRedirect: "/login-failed",
//   })
// );

// // Facebook Authentication Routes
// app.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );

// app.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/success",
//     failureRedirect: "/login-failed",
//   })
// );

// // Routes
// app.get("/success", (req, res) => {
//   res.send(`<h1>Login Successful</h1><p>Welcome ${req.user.displayName}</p>`);
// });

// app.get("/login-failed", (req, res) => {
//   res.send("Login Failed");
// });

// app.get("/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect("/");
//   });
// });

