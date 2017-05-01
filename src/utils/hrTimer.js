export default (startTime = process.hrtime()) => (
  endTime = process.hrtime(startTime)
) => ({
  prettyPrint: `${endTime[0]}s ${endTime[1] / 1e6}ms`,
  seconds: endTime[0],
  ms: endTime[1] / 1e6,
  ns: endTime[1]
});
