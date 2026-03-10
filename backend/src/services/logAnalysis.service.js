const fs = require("fs");
const readline = require("readline");
const { extractErrorType } = require("../utils/errorParser.util");
const { extractHour } = require("../utils/timeParser.util");

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

        // Extract error type
        const errorType = extractErrorType(line);

        errorMap[errorType] = (errorMap[errorType] || 0) + 1;

        // Extract hour
        const hour = extractHour(line);

        if (hour) {
          timeMap[hour] = (timeMap[hour] || 0) + 1;
        }

      } 
      else if (currentError && line.trim().startsWith("at")) {
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
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([hour, count]) => {

        const startHour = parseInt(hour);
        const endHour = (startHour + 1) % 24;

        const start = String(startHour).padStart(2, "0");
        const end = String(endHour).padStart(2, "0");

        return {
          range: `${start}:00 - ${end}:00`,
          count,
        };
      });

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