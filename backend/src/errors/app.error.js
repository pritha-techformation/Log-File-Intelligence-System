// Custom error class
class AppError extends Error {

  // Constructor function to create an instance of the AppError class
  constructor(message, statusCode = 400) {

    // Call the constructor of the parent class (Error)
    super(message);
    // Set the status code
    this.statusCode = statusCode;
  }
}

// Export the AppError class
module.exports = AppError;