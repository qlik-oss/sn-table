import React from 'react';

interface PageOptionsProps {
  totalPages: number;
  page: number;
}

export const MAX_PAGE_OPTIONS_LENGTH = 1000;

export const HALF_MAX_LENGTH = MAX_PAGE_OPTIONS_LENGTH / 2;

export const ELLIPSIS = '…';

const PageOptions = ({ totalPages, page }: PageOptionsProps) => {
  const pageOptionsLength = Math.min(totalPages, MAX_PAGE_OPTIONS_LENGTH);
  const hasTooManyPages = pageOptionsLength < totalPages && page > HALF_MAX_LENGTH;
  const endPageIndex = hasTooManyPages ? Math.min(HALF_MAX_LENGTH + page, totalPages) : pageOptionsLength;
  const startPageIndex = hasTooManyPages ? Math.max(0, endPageIndex - MAX_PAGE_OPTIONS_LENGTH) : 0;

  const Options = Array.from(Array(pageOptionsLength).keys()).map((pageIdx) => {
    const idx = pageIdx + startPageIndex;
    return (
      <option key={idx} value={idx}>
        {idx + 1}
      </option>
    );
  });

  if (startPageIndex > 0) {
    Options.unshift(
      <option key="startMoreOptions" value={ELLIPSIS} disabled>
        {ELLIPSIS}
      </option>
    );
  }

  if (endPageIndex < totalPages - 1) {
    Options.push(
      <option key="endMoreOptions" value={ELLIPSIS} disabled>
        {ELLIPSIS}
      </option>
    );
  }

  return <>{Options}</>;
};

export default PageOptions;
