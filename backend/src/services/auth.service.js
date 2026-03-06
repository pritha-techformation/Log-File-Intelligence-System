const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const { generateToken } = require("../config/jwt");
const AppError = require("../errors/app.error");

class AuthService {

  async signup(data) {

    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser({
      ...data,
      password: hashedPassword,
      status: "pending"
    });

    return user;
  }


  async login(email, password) {

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.status !== "approved") {
      throw new AppError("User not approved", 403);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    return { user, token };
  }
}

module.exports = new AuthService();