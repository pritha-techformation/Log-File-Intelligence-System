const User = require("../models/user.model");

class UserRepository {

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async findById(id) {
    return await User.findById(id);
  }

}

module.exports = new UserRepository();