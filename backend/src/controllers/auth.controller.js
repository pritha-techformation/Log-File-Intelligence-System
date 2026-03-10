// Authentication Controller
const authService = require("../services/auth.service");
const { validateSignup, validateLogin } = require("../validations/auth.validation");


// controller Signup function
exports.signup = async (req, res, next) => {
  try {
    // Validate request body for signup fields
    validateSignup(req.body);

    // Call service to create a new user in the database
    await authService.signup(req.body);

    // Send response to client after successful signup
    res.status(201).json({
      message: "Signup successful. Await admin approval."
    });

  } catch (err) {
    // Pass error to global error handler middleware
    next(err);
  }
};


// Controller function for user login
exports.login = async (req, res, next) => {
  try {

    // Validate request body for login
    validateLogin(req.body);

    // Get email and password from request body
    const { email, password } = req.body;

    // Call service to login user
    const result = await authService.login(email, password);

    // Send response to client
    res.json(result);

  } catch (err) {

    // Pass error to global error handler middleware
    next(err);
  }
};