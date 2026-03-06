const authService = require("../services/auth.service");
const { validateSignup, validateLogin } = require("../validations/auth.validation");

exports.signup = async (req, res, next) => {
  try {
    validateSignup(req.body);

    const user = await authService.signup(req.body);

    res.status(201).json({
      message: "Signup successful. Await admin approval."
    });

  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    validateLogin(req.body);

    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(result);

  } catch (err) {
    next(err);
  }
};