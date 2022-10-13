import copyCellValue from '../copy-utils';

describe('copyCellValue: ', () => {
  let evt: {
    target: HTMLElement;
  };
  beforeEach(() => {
    console.log = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not send console error when copying cell values', () => {
    evt = {
      target: {
        children: [],
      } as unknown as HTMLElement,
    };
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockReturnValueOnce(Promise.resolve()),
      },
    });
    copyCellValue(evt);
    expect(console.log).not.toHaveBeenCalled();
  });
});
