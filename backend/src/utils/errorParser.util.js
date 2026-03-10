// utils/errorParser.util.js

exports.extractErrorType = (line) => {

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

  return errorType;
};