const Log = require("../models/log.model");
const logAnalyzerService = require("../services/logAnalysis.service");
const paginationUtil = require("../utils/pagination.util");

// Upload Logs by Users
exports.uploadLog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const log = await Log.create({
      user: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      status: "processing",
    });

    try {
      const analysis = await logAnalyzerService.analyzeLog(req.file.path);

      log.analysis = analysis;
      log.status = "completed";
    } catch (err) {
      log.status = "failed";
      await log.save();

      console.error("Log analysis error:", err);

      return res.status(500).json({
        message: "Log analysis failed",
      });
    }

    await log.save();

    res.status(200).json({
      message: "File processed successfully",
      log,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Log processing failed",
    });
  }
};

// Get My Logs
exports.getMyLogs = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user.id })
      .select("fileName status createdAt analysis")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch logs",
    });
  }
};

// Get Log Report By ID

exports.getLogById = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching log",
    });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const { user, file } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const matchStage = {};

    if (file) {
      matchStage.fileName = { $regex: file, $options: "i" };
    }

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "users", // users collection
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" }, // removes logs where user is deleted

      ...(user
        ? [
            {
              $match: {
                "user.name": { $regex: user, $options: "i" }
              }
            }
          ]
        : []),

      { $sort: { createdAt: -1 } },

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

    const result = await Log.aggregate(pipeline);

    const logs = result[0].logs;

    const total = result[0].totalCount[0]?.count || 0;

    const pagination = paginationUtil(page, limit, total);

    res.json({
      logs,
      pagination
    });

  } catch (error) {
    console.error("GET ALL LOGS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch logs",
      error: error.message
    });
  }
};

exports.getPublicReport = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({
      analysis: log.analysis,
      fileName: log.fileName,
      createdAt: log.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch report" });
  }
};
