import hrTimer from "./hrTimer";

// jest.useRealTimers();

describe("hr Timer returns time formated as string", () => {
  const withTimeout = hrTimer();
  const endTime = withTimeout();

  it("Returns millisecconds", async () => {
    expect(typeof endTime.ms).toBe("number");
  });

  it("times nanoseconds", async () => {
    expect(typeof endTime.ns).toBe("number");
  });

  it("times seconds", async () => {
    expect(typeof endTime.seconds).toBe("number");
  });

  it("returns pretty printed string", async () => {
    expect(typeof endTime.prettyPrint).toBe("string");
  });

  it("returns pretty printed string formatted correctly", async () => {
    expect(endTime.prettyPrint).toBe(`${endTime.seconds}s ${endTime.ms}ms`);
  });

  it("returns an object", async () => {
    expect(typeof endTime).toBe("object");
  });
});
