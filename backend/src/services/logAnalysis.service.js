const fs = require("fs");
const readline = require("readline");

class LogAnalyzerService {
  async analyzeLog(filePath) {
    const errorMap = {};
    const timeMap = {};
    const errors = [];

    let totalErrors = 0;
    let currentError = null;

    const stream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {

      if (/(ERROR|FATAL|CRITICAL)/i.test(line)) {

        if (currentError) {
          errors.push(currentError.join("\n"));
        }

        currentError = [line];
        totalErrors++;

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

            errorType = statusMap[code] || `HTTP ${code} Error`;
          }
        }

        // 3️⃣ Error: message
        if (!errorType) {
          const errorMsgMatch = line.match(/Error:\s(.+)/i);
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

        errorMap[errorType] = (errorMap[errorType] || 0) + 1;

        // Extract hour
        const isoMatch = line.match(/T(\d{2}):\d{2}:\d{2}/);
        const normalMatch = line.match(/\s(\d{2}):\d{2}:\d{2}/);

        let hour = null;

        if (isoMatch) hour = isoMatch[1];
        else if (normalMatch) hour = normalMatch[1];

        if (hour) {
          timeMap[hour] = (timeMap[hour] || 0) + 1;
        }

      } else if (currentError && line.trim().startsWith("at")) {
        currentError.push(line);
      }
    }

    if (currentError) {
      errors.push(currentError.join("\n"));
    }

    const topErrors = Object.entries(errorMap)
      .filter(([type]) => type && type.trim().length > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({
        type: type || "Unknown Error",
        count,
      }));

    let mostFrequentTimeRange = null;

    const hourEntry = Object.entries(timeMap).sort((a, b) => b[1] - a[1])[0];

    if (hourEntry) {
      const hour = hourEntry[0].padStart(2, "0");
      mostFrequentTimeRange = `${hour}:00 - ${hour}:59`;
    }

    const timeRanges = Object.entries(timeMap)
      .sort((a, b) => a[0] - b[0])
      .map(([hour, count]) => ({
        range: `${hour.padStart(2, "0")}:00`,
        count,
      }));

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