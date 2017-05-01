import hrTimer from "./hrTimer";

jest.useRealTimers();

describe("hr Timer returns time formated as string", () => {
  function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  it("times accurately", async () => {
    const withTimeout = hrTimer();
    await sleep(100);
    // We account for a margin of error, as this function is
    // run in paralell with others, making it unprecise at best.
    const endTime = withTimeout();
    expect(endTime.ms).toBeGreaterThanOrEqual(100);
    expect(endTime.ms).toBeLessThanOrEqual(100);
  });
});
