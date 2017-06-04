// @flow
const process = require("process");

// Timer function for high resolution timing
export default (
  // Start timer, exposing a end-time function for a future call.
  startTime = process.hrtime()
) => (
  // End time function
  endTime = process.hrtime(startTime)
) => ({
  // prettyPring neatly formated timer
  prettyPrint: `${endTime[0]}s ${endTime[1] / 1e6}ms`,
  // only seconds
  seconds: endTime[0],
  // milliseconds
  ms: endTime[1] / 1e6,
  // nanoseconds
  ns: endTime[1]
});
