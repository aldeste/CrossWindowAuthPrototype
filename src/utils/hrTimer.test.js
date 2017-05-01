import hrTimer from "./hrTimer";

jest.useRealTimers();

describe("hr Timer returns time formated as string", () => {
  const sleep = time => new Promise(resolve => setTimeout(resolve, time));

  it("times accurately", async () => {
    const withTimeout = hrTimer();
    await sleep(100);
    const endTime = withTimeout();
    // We account for a margin of error, as this function is
    // run in paralell with others, making it unprecise at best.
    expect(endTime.ms).toBeGreaterThanOrEqual(95);
    expect(endTime.ms).toBeLessThanOrEqual(110);
  });
});
