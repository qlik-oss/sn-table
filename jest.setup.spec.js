import '@testing-library/jest-dom';

beforeEach(() => {
  const context = {
    measureText(text) {
      return {
        width: text?.length ?? 0,
      };
    },
  };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
});
