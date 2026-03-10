// utils/timeParser.util.js

exports.extractHour = (line) => {

  const isoMatch = line.match(/T(\d{2}):\d{2}:\d{2}/);
  const normalMatch = line.match(/\s(\d{2}):\d{2}:\d{2}/);

  let hour = null;

  if (isoMatch) hour = isoMatch[1];
  else if (normalMatch) hour = normalMatch[1];

  return hour;
};