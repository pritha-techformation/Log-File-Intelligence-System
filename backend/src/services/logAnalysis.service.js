// services/logAnalysis.service.js
const fs = require("fs");
const readline = require("readline");

// Log Analyzer Service
class LogAnalyzerService {

  // Analyze a log file 
  async analyzeLog(filePath) {

    // Create maps to store errors and time ranges
    const errorMap = {};
    const timeMap = {};
    const errors = [];

    // Initialize variables
    let totalErrors = 0;
    let currentError = null;

    // Read the log file line by line
    const stream = fs.createReadStream(filePath);

    // Create a readline interface
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    // Iterate over each line
    for await (const line of rl) {

      // Check if the line contains an error
      if (/(ERROR|FATAL|CRITICAL)/i.test(line)) {

        // If there is a current error, add it to the errors array
        if (currentError) {
          errors.push(currentError.join("\n"));
        }

        // Start a new error and increment the total error count
        currentError = [line];
        totalErrors++;

        //  Initialize the error type
        let errorType = null;

        // 1️⃣ message="..."
        const messageMatch = line.match(/message="([^"]+)"/i);
        if (messageMatch) {
          errorType = messageMatch[1];
        }

        // 2️⃣ HTTP status codes
        if (!errorType) {
          const statusMatch = line.match(/status=(\d{3})/);
          if (statusMatch) {
            const code = statusMatch[1];

            const statusMap = {
              400: "Bad Request",
              401: "Unauthorized",
              403: "Forbidden",
              404: "Not Found",
              413: "File Size Limit Exceeded",
              429: "Too Many Requests",
              500: "Internal Server Error",
              502: "Bad Gateway",
              503: "Service Unavailable",
              504: "Gateway Timeout",
            };

            // Map the status code to an error type
            errorType = statusMap[code] || `HTTP ${code} Error`;
          }
        }

        // 3️⃣ Error: message
        if (!errorType) {
          const errorMsgMatch = line.match(/Error:\s(.+)/i);
          // Extract the error message
          if (errorMsgMatch) {
            errorType = errorMsgMatch[1]
              .split(/\s(userId|transactionId|file|ip|path|status)=/)[0]
              .trim()
              .split(" ")
              .slice(0, 6)
              .join(" ");
          }
        }

        // 4️⃣ generic ERROR message
        if (!errorType) {
          const genericMatch = line.match(/ERROR\s+(.*)/i);

          // Extract the error message
          if (genericMatch) {
            let msg = genericMatch[1];

            msg = msg.replace(/at\s.+/, "");

            msg = msg.split(/\s(userId|transactionId|file|ip|path|status)=/)[0];

            errorType = msg.trim().split(" ").slice(0, 6).join(" ");
          }
        }

        // 5️⃣ final fallback
        if (!errorType || errorType.trim() === "") {
          errorType = "Unknown Error";
        }

        // Add the error type to the map
        errorMap[errorType] = (errorMap[errorType] || 0) + 1;

        // Extract hour
        const isoMatch = line.match(/T(\d{2}):\d{2}:\d{2}/);
        const normalMatch = line.match(/\s(\d{2}):\d{2}:\d{2}/);

        // Initialize the hour
        let hour = null;

        // Check for ISO format
        if (isoMatch) hour = isoMatch[1];
        else if (normalMatch) hour = normalMatch[1];

        // Add the hour to the map
        if (hour) {
          timeMap[hour] = (timeMap[hour] || 0) + 1;
        }

      } else if (currentError && line.trim().startsWith("at")) {
        // Add the line to the current error
        currentError.push(line);
      }
    }

    // Add the last error
    if (currentError) {
      errors.push(currentError.join("\n"));
    }

    // Sort the errors by count and take the top 5
    const topErrors = Object.entries(errorMap)
      .filter(([type]) => type && type.trim().length > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({
        type: type || "Unknown Error",
        count,
      }));

      // Sort the time map by count
    let mostFrequentTimeRange = null;

    // Get the hour with the highest count
    const hourEntry = Object.entries(timeMap).sort((a, b) => b[1] - a[1])[0];

    // If there is a hour with the highest count
    if (hourEntry) {
      const hour = hourEntry[0].padStart(2, "0");
      mostFrequentTimeRange = `${hour}:00 - ${hour}:59`;
    }

    // Sort the time map by count
   const timeRanges = Object.entries(timeMap)
  .sort((a, b) => Number(a[0]) - Number(b[0]))
  .map(([hour, count]) => {

    // Get the start and end hour
    const startHour = parseInt(hour);
    const endHour = (startHour + 1) % 24;

    // Format the time range
    const start = String(startHour).padStart(2, "0");
    const end = String(endHour).padStart(2, "0");

    // Return the time range
    return {
      range: `${start}:00 - ${end}:00`,
      count,
    };
  });

  // Return the data to be used in the front-end
    return {
      topErrors,
      errorFrequency: totalErrors,
      mostFrequentTimeRange,
      timeRanges,
      errors,
    };
  }
}

module.exports = new LogAnalyzerService();