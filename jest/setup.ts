import "@testing-library/jest-dom";

beforeEach(() => {
  const context = {
    measureText(text: string | undefined) {
      return {
        width: text?.length ?? 0,
      };
    },
  } as CanvasRenderingContext2D;
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
});
