const fs = require("fs");
const readline = require("readline");

exports.analyzeLog = async (filePath) => {
  const errorMap = {};
  const timeMap = {};
  let totalErrors = 0;

  const stream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.includes("ERROR")) continue;

    totalErrors++;

    // Extract error type
    const errorMatch = line.match(/ERROR\s+\[(.*?)\]/i);
    const errorType = errorMatch ? errorMatch[1] : "Unknown";

    errorMap[errorType] = (errorMap[errorType] || 0) + 1;

    // Extract hour safely
    const timeMatch = line.match(/\d{4}-\d{2}-\d{2}\s(\d{2}):\d{2}:\d{2}/);

    if (timeMatch) {
      const hour = parseInt(timeMatch[1]); // convert to number
      timeMap[hour] = (timeMap[hour] || 0) + 1;
    }
  }

  // Top 5 errors
  const topErrors = Object.entries(errorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));

  // Most frequent hour
  let mostFrequentTimeRange = null;

  const hourEntry = Object.entries(timeMap).sort((a, b) => b[1] - a[1])[0];

  if (hourEntry) {
    const hour = hourEntry[0].toString().padStart(2, "0");
    mostFrequentTimeRange = `${hour}:00 - ${hour}:59`;
  }

  const timeRanges = Object.entries(timeMap)
  .sort((a, b) => a[0] - b[0])
  .map(([hour, count]) => ({
    range: `${hour.toString().padStart(2, "0")}:00`,
    count,
  }));

  return {
    topErrors,
    errorFrequency: totalErrors,
    mostFrequentTimeRange,
    timeRanges,
  };
};