describe("cli", () => {
  let originalArgv;

  beforeEach(() => {
    jest.resetModules(); // Remove all cached modules.
    // Each test overwrites process arguments so store the original arguments
    originalArgv = process.argv;
  });

  afterEach(() => {
    jest.resetAllMocks();
    // Set process arguments back to the original value
    process.argv = originalArgv;
  });

  it("should run install command", async () => {
    // const mockConsoleData = [
    //   "Average height of queried pokemons: 9.05",
    //   "Average height of queried pokemons: 267.85",
    // ];

    const cSpy = await jest.spyOn(console, "log");
    //   .mockResolvedValue(mockConsoleData);

    await runCommand("pokemon", "0", "0");

    expect(cSpy).toContain("9.05");
    expect(cSpy).toContain("267.85");

    cSpy.mockRestore();
  });
});

/**
 * Programmatically set arguments and execute the CLI script
 */
async function runCommand(...args) {
  process.argv = ["node", "index.js", ...args];

  // Require the yargs CLI script
  return require("../src/index");
}
