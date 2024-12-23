const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Check for mandatory fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are mandatory",
      });
    }

    // Check if mobile is provided for candidate
    if (role === "candidate" && !mobile) {
      return res.status(400).json({
        message: "Mobile number is mandatory for candidates",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user based on role
    const userData = {
      name,
      email,
      password,
      role,
      ...(role === "candidate" && { mobile }), // Add mobile only for candidates
    };

    const user = await User.create(userData);
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === "candidate" && { mobile: user.mobile }),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user and include password for verification
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role === "candidate" && { mobile: user.mobile }),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
