import React, { memo, useMemo } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import ArrowLeft from '@qlik-trial/sprout/icons/react/ArrowLeft';
import ArrowLeftStop from '@qlik-trial/sprout/icons/react/ArrowLeftStop';
import ArrowRight from '@qlik-trial/sprout/icons/react/ArrowRight';
import ArrowRightStop from '@qlik-trial/sprout/icons/react/ArrowRightStop';

import { StyledSelect, StyledButton, StyledTypography } from './styles';
import { handleLastTab } from '../../table/utils/handle-keyboard';
import { PaginationContentProps } from '../../table/types';
import { getFooterStyle } from '../../table/utils/styling-utils';
import { DEFAULT_FONT_SIZE } from '../../table/styling-defaults';
import { areTabStopsEnabled } from '../../table/utils/accessibility-utils';
import PageOptions from './PageOptions';

const icons: Record<string, typeof ArrowLeft> = {
  FirstPage: ArrowLeftStop,
  PreviousPage: ArrowLeft,
  NextPage: ArrowRight,
  LastPage: ArrowRightStop,
  FirstPageRTL: ArrowRightStop,
  PreviousPageRTL: ArrowRight,
  NextPageRTL: ArrowLeft,
  LastPageRTL: ArrowLeftStop,
};

export const shouldShow = (component: string, width: number) => {
  switch (component) {
    case 'selectPage':
      return width > 700;
    case 'rppOptions':
      return width > 550;
    case 'firstLast':
      return width > 350;
    case 'displayedRows':
      return width > 250;
    default:
      return false;
  }
};

function PaginationContent({
  direction,
  pageInfo,
  setPageInfo,
  footerContainer,
  announce,
  isSelectionMode,
  handleChangePage,
  tableData,
  keyboard,
  translator,
  background,
  constraints,
  rect,
}: PaginationContentProps) {
  const { totalRowCount, totalColumnCount, totalPages } = tableData;
  const { page, rowsPerPage, rowsPerPageOptions } = pageInfo;
  const footerStyle = useMemo(() => getFooterStyle(background), [background]);
  const onFirstPage = page === 0;
  const onLastPage = page >= totalPages - 1;
  // The elements can be focused in sequential keyboard navigation:
  // - When nebula handles keyboard navigation
  // and focus is somewhere inside the extension, or
  // - When nebula does not handle keyboard navigation
  const tabIndex = areTabStopsEnabled(keyboard) ? 0 : -1;
  const width = footerContainer ? footerContainer.getBoundingClientRect().width : rect.width;
  const showFirstAndLast = shouldShow('firstLast', width);
  const showRowsPerPage =
    !!rowsPerPageOptions.length && !isSelectionMode && shouldShow('rppOptions', width) && totalColumnCount <= 100;
  const displayedRowsText = translator.get('SNTable.Pagination.DisplayedRowsLabel', [
    `${page * rowsPerPage + 1} - ${Math.min((page + 1) * rowsPerPage, totalRowCount)}`,
    totalRowCount.toString(),
  ]);

  // TODO: put in table only wrapper, since it is only needed for the paginated table
  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setPageInfo({ ...pageInfo, page: 0, rowsPerPage: +event.target.value });
    announce?.({
      keys: [['SNTable.Pagination.RowsPerPageChange', event.target.value.toString()]],
      politeness: 'assertive',
    });
  };

  const handleSelectPage = (event: SelectChangeEvent<number>) => handleChangePage(+event.target.value);

<<<<<<< Updated upstream:src/table/components/footer/PaginationContent.tsx
  const handleLastButtonTab = keyboard.enabled
    ? (event: React.KeyboardEvent) => handleLastTab(event, keyboard, isSelectionMode)
=======
  const handleLastButtonTab = keyboard?.enabled
    ? (event: React.KeyboardEvent) => handleLastTab(event, isSelectionMode, keyboard)
>>>>>>> Stashed changes:src/table-commons/footer/PaginationContent.tsx
    : null;

  const getButton = (
    disabledCondition: boolean,
    pageNumber: number,
    type: string,
    onKeyDown: ((event: React.KeyboardEvent) => void) | null
  ) => {
    const iconType = `${type}${direction === 'rtl' ? 'RTL' : ''}`;
    const IconComponent = icons[iconType];

    return (
      <StyledButton
        footerStyle={footerStyle}
        disabledCondition={disabledCondition}
        size="small"
        data-testid="pagination-action-icon-button"
        onClick={!disabledCondition ? () => handleChangePage(pageNumber) : null}
        aria-disabled={disabledCondition}
        aria-label={translator.get(`SNTable.Pagination.${type}`)}
        title={!constraints.passive ? translator.get(`SNTable.Pagination.${type}`) : undefined}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
      >
        <IconComponent height={DEFAULT_FONT_SIZE} />
      </StyledButton>
    );
  };

  const getDropdown = (
    name: string,
    value: number,
    options: JSX.Element,
    handleChange: (event: SelectChangeEvent<number>) => void
  ) => {
    const label = translator.get(`SNTable.Pagination.${name}`);
    const id = `${name}-dropdown`;
    const labelId = `${id}-label`;
    const inputProps = {
      tabIndex,
      id,
      'data-testid': id,
    };

    return (
      <>
        <StyledTypography variant="caption" id={labelId}>
          {label}:
        </StyledTypography>
        <StyledSelect
          footerStyle={footerStyle}
          size="small"
          native
          value={value}
          onChange={handleChange}
          inputProps={inputProps}
          aria-labelledby={labelId}
        >
          {options}
        </StyledSelect>
      </>
    );
  };

  const rppOptions = (
    <>
      {rowsPerPageOptions.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </>
  );

  const pageOptions = <PageOptions totalPages={totalPages} page={page} />;

  return (
    <>
      {showRowsPerPage && getDropdown('RowsPerPage', rowsPerPage, rppOptions, handleChangeRowsPerPage)}
      {shouldShow('selectPage', width) && getDropdown('SelectPage', page, pageOptions, handleSelectPage)}
      {shouldShow('displayedRows', width) && <StyledTypography variant="caption">{displayedRowsText}</StyledTypography>}
      {showFirstAndLast && getButton(onFirstPage, 0, 'FirstPage', null)}
      {getButton(onFirstPage, page - 1, 'PreviousPage', null)}
      {getButton(onLastPage, page + 1, 'NextPage', !showFirstAndLast ? handleLastButtonTab : null)}
      {showFirstAndLast && getButton(onLastPage, totalPages - 1, 'LastPage', handleLastButtonTab)}
    </>
  );
}

export default memo(PaginationContent);
