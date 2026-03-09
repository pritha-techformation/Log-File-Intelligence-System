const Log = require("../models/log.model");
const logAnalyzerService = require("../services/logAnalysis.service");

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

exports.getLogById = async (req, res) => {
  try {

    const log = await Log.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    // if (log.user.toString() !== req.user.id && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Forbidden" });
    // }

    res.json(log);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching log",
    });

  }
};

exports.getAllLogs = async (req, res) => {
  try {

    const logs = await Log.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching logs",
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