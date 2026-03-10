const Log = require("../models/log.model");
const logAnalyzerService = require("../services/logAnalysis.service");
const paginationUtil = require("../utils/pagination.util");
const User = require("../models/user.model");

// Upload Logs by Users
exports.uploadLog = async (req, res) => {
  try {

    // Find the current user from database
    const user = await User.findById(req.user.id);

    // If user does not exist
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

     // If user is inactive, prevent file upload
    if (user.activity === "inactive") {
      return res.status(403).json({
        message: "Your account is inactive. You cannot upload files.",
      });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create a new log and save the status as processing by default
    const log = await Log.create({
      user: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      status: "processing",
    });

    try {

      // Analyze the log
      const analysis = await logAnalyzerService.analyzeLog(req.file.path);

      // Update the log with the analysis results and change status to completed
      log.analysis = analysis;
      log.status = "completed";
    } catch (err) {

      // Update the log with the error message and change status to failed
      log.status = "failed";

      // Save the log
      await log.save();

      // Return an error response
      return res.status(500).json({
        message: "Log analysis failed",
      });
    }

    // Save the log
    await log.save();

    // Return a success response
    res.status(200).json({
      message: "File processed successfully",
      log,
    });
  } catch (error) {
    console.error(error);

    // Return an error response
    res.status(500).json({
      message: "Log processing failed",
    });
  }
};

// Get My Logs
exports.getMyLogs = async (req, res) => {
  try {

    // Find all logs for the current user and return them sorted by creation date
    const logs = await Log.find({ user: req.user.id })
      .select("fileName status createdAt analysis")
      .sort({ createdAt: -1 });

      // Return the logs with a success response
    res.status(200).json(logs);
  } catch (error) {

    // Return an error response
    res.status(500).json({
      message: "Failed to fetch logs",
    });
  }
};

// Get Log Report By ID
exports.getLogById = async (req, res) => {
  try {

    // Find the log by id
    const log = await Log.findById(req.params.id);

    // If the log is not found, return a 404 response
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    // Return the log
    res.json(log);
  } catch (error) {

    // Return an error response
    res.status(500).json({
      message: "Error fetching log",
    });
  }
};

// Get All Logs
exports.getAllLogs = async (req, res) => {
  try {

    // Get log file name and user name from query parameters
    const { user, file } = req.query;

    // Get page number and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Create match stage
    const matchStage = {};

    // If file name is provided, add it to the match stage
    if (file) {
      matchStage.fileName = { $regex: file, $options: "i" };
    }

    // Create aggregation pipeline
    const pipeline = [
      { $match: matchStage },

      // Add lookup stage
      {
        $lookup: {
          from: "users", 
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" }, // removes logs where user is deleted

      // Add match stage for user
      ...(user
        ? [
            {
              $match: {
                "user.name": { $regex: user, $options: "i" }
              }
            }
          ]
        : []),

      // Add sort stage
      { $sort: { createdAt: -1 } },

      // Add facet stage
      {
        $facet: {
          logs: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ];

    // Execute aggregation pipeline
    const result = await Log.aggregate(pipeline);

    // Get logs and total count
    const logs = result[0].logs;

    // Get total count
    const total = result[0].totalCount[0]?.count || 0;

    // Calculate pagination
    const pagination = paginationUtil(page, limit, total);

    // Return logs and pagination
    res.json({
      logs,
      pagination
    });

  } catch (error) {

    // Return an error response
    res.status(500).json({
      message: "Failed to fetch logs",
      error: error.message
    });
  }
};


