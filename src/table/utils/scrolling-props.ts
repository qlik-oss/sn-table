export type ScrollingProps = {
  horizontal?: boolean;
  keepFirstColumnInView?: boolean;
  keepFirstColumnInViewTouch?: boolean;
};

export const freezeFirstColumn = ({ scrolling }: { scrolling: ScrollingProps }) => {
  return scrolling?.keepFirstColumnInView;
};
