const PADDING = 12 * 2;
const BORDER = 1;

const measureCell = (lineHeight: number, text: string, columnWidth: number, measureText: (text: string) => number) => {
  const width = measureText(text);
  const height = Math.max(1, Math.ceil(width / (columnWidth - PADDING - BORDER))) * lineHeight; // * (Math.random() * 10);

  return { width, height };
};

export default measureCell;
