import '@testing-library/jest-dom';

beforeEach(() => {
  const context = {
    measureText(text) {
      return {
        width: text?.length ?? 0
      }
    },
    set font(f) {}
  };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
});
