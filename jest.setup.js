import '@testing-library/jest-dom';

beforeEach(() => {
  const context = {
    measureText(text) {
      return {
        width: text?.length ?? 0,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    set font(f) {},
  };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
});
