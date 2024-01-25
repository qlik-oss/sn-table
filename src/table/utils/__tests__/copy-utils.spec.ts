import copyCellValue from "../copy-utils";

describe("copyCellValue:", () => {
  let cellElement: HTMLElement;
  let writeMock: (arg: string) => void;

  beforeEach(() => {
    cellElement = {
      querySelector: () => ({
        textContent: "text",
      }),
    } as unknown as HTMLElement;
    jest.spyOn(console, "log");
    writeMock = jest.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeMock },
    });
  });

  afterEach(() => jest.clearAllMocks());

  it("should call clipboard.writeText but not console log for a table cell", async () => {
    await copyCellValue(cellElement);
    expect(global.console.log).toHaveBeenCalledTimes(0);
    expect(writeMock).toHaveBeenCalledTimes(1);
    expect(writeMock).toHaveBeenCalledWith("text");
  });

  it("should not call clipboard.writeText nor console log when value is not defined", async () => {
    cellElement = {
      querySelector: () => undefined,
    } as unknown as HTMLElement;
    await copyCellValue(cellElement);

    expect(global.console.log).toHaveBeenCalledTimes(0);
    expect(writeMock).toHaveBeenCalledTimes(0);
  });

  it("should call console.log when writeText throws error", async () => {
    writeMock = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    Object.assign(navigator, {
      clipboard: { writeText: writeMock },
    });

    await copyCellValue(cellElement);
    expect(writeMock).toHaveBeenCalledTimes(1);
    expect(global.console.log).toHaveBeenCalledTimes(1);
  });
});
