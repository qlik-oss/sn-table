import copyCellValue from '../copy-utils';

describe('copyCellValue:', () => {
  let evt: {
    target: HTMLElement;
  };
  let writeMock: (arg: string) => void;
  let elementClass: string;

  const classList = {
    contains: (className: string) => className === elementClass,
  };

  const closest = () => ({
    querySelector: () => ({
      textContent: 'textFromClosest',
    }),
  });

  beforeEach(() => {
    elementClass = '';
    evt = {
      target: {
        closest,
        querySelector: () => ({
          textContent: 'text',
        }),
        classList,
      } as unknown as HTMLElement,
    };
    jest.spyOn(console, 'log');
    writeMock = jest.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeMock },
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('should call clipboard.writeText but not console log for a table cell', async () => {
    elementClass = 'sn-table-cell';
    await copyCellValue(evt);
    expect(global.console.log).toHaveBeenCalledTimes(0);
    expect(writeMock).toHaveBeenCalledTimes(1);
    expect(writeMock).toHaveBeenCalledWith('text');
  });

  it('should call clipboard.writeText but not console log for a non-table cell', async () => {
    elementClass = '';
    await copyCellValue(evt);
    expect(global.console.log).toHaveBeenCalledTimes(0);
    expect(writeMock).toHaveBeenCalledTimes(1);
    expect(writeMock).toHaveBeenCalledWith('textFromClosest');
  });

  it('should not call clipboard.writeText nor console log when value is not defined', async () => {
    evt = {
      target: {
        querySelector: () => undefined,
        classList,
      } as unknown as HTMLElement,
    };
    elementClass = 'sn-table-cell';
    await copyCellValue(evt);

    expect(global.console.log).toHaveBeenCalledTimes(0);
    expect(writeMock).toHaveBeenCalledTimes(0);
  });

  it('should call console.log when writeText throws error', async () => {
    writeMock = jest.fn().mockImplementation(() => {
      throw new Error();
    });
    Object.assign(navigator, {
      clipboard: { writeText: writeMock },
    });
    evt = {
      target: {
        querySelector: () => ({
          textContent: 'text',
        }),
        classList,
      } as unknown as HTMLElement,
    };
    elementClass = 'sn-table-cell';

    await copyCellValue(evt);
    expect(writeMock).toHaveBeenCalledTimes(1);
    expect(global.console.log).toHaveBeenCalledTimes(1);
  });
});
