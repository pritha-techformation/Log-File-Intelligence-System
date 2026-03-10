// repositories/user.repository.js

const User = require("../models/user.model");

// User repository class
class UserRepository {

  // Methods

  // Find user by email
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  // Create user
  async createUser(data) {
    return await User.create(data);
  }

  // Find user by id
  async findById(id) {
    return await User.findById(id);
  }

}

module.exports = new UserRepository();