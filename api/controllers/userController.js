const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const saltRounds = 12;
const secret = process.env.JWT_SECRET || "fallback-secret";


const errorHandler = (res, error, status = 500) => {
  console.error(error);
  res.status(status).json({ error: error.message || "Internal server error" });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const userExists = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }],
    });
    if (userExists) {
      return res.status(400).json({ error: "Username or email already exists." });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const userDoc = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully", user: userDoc });
  } catch (err) {
    errorHandler(res, err);
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userDoc = await User.findOne(
      /\S+@\S+\.\S+/.test(username) ? { email: username.toLowerCase() } : { username }
    );

    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      const token = jwt.sign(
        { id: userDoc._id, username: userDoc.username, role: userDoc.role },
        secret
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
        })
        .json({
          id: userDoc.id,
          username,
          email: userDoc.email,
          role: userDoc.role,
        });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    errorHandler(res, err);
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email: email.toLowerCase() });
    if (!oldUser) return res.status(404).json({ error: "User not found" });

    const resetToken = jwt.sign(
      { id: oldUser._id, email: oldUser.email },
      secret + oldUser.password,
      { expiresIn: "15m" }
    );
    const resetLink = `http://localhost:3050/reset-password/${oldUser._id}/${resetToken}`;


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Reset your password using this link: ${resetLink}`,
    });

    res.json({ message: "Reset link sent to your email" });
    } catch (err) {
      errorHandler(res, err);
    }
};

// Reset password (GET)
const resetPasswordGet = async (req, res) => {
  const { id, token } = req.params;
  try {
    const user = await User.findById(id);
    jwt.verify(token, secret + user.password);
    res.status(200).json({ email: user.email });
  } catch {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

// Reset password (POST)
const resetPasswordPost = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findById(id);
    jwt.verify(token, secret + user.password);

    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

// Get user profile
const profile = async (req, res) => {
  res.json(req.user);
};


// Logout
const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .json({ message: "Logged out successfully" });
};

const sendMassage = (req, res) => {
  const { name, email, message } = req.body;
    
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
    
    
  // Email options
  const mailOptions = {
    from: email,
    to: "analyzedbyiitians@gmail.com", 
    subject: `Feedback massage by ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send message." });
    }
    res.status(200).json({ message: "Message sent successfully" });
  });
};

// Exports
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPasswordGet,
  resetPasswordPost,
  profile,
  logout,
  sendMassage
};
