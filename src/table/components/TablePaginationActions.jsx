import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { handleLastTab } from '../utils/handle-key-press';

const icons = {
  FirstPage: FirstPageIcon,
  PreviousPage: KeyboardArrowLeft,
  NextPage: KeyboardArrowRight,
  LastPage: LastPageIcon,
};

const PaginationActionIconButton = styled(IconButton)(({ disabledCondition }) => ({
  color: disabledCondition ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.54)',
  cursor: disabledCondition && 'default',
}));

const TablePaginationActionsSection = styled('div')({
  flexShrink: 0,
  paddingLeft: '24px',
  transform: 'translate(0px, 4px)',
});

const Caption = styled(InputLabel)({
  fontSize: '14px',
  color: 'inherit',
  width: 'fit-content',
  position: 'relative',
  transform: 'translate(0px, 12px)',
  paddingRight: '8px',
  height: '30px',
});

const PaginationSelect = styled(Select)({
  cursor: 'pointer',
  minWidth: '16px',
  maxHeight: '32px',
  transform: 'translate(0px, 6px)',
});

const CustomFormControl = styled(FormControl)({
  flexDirection: 'row',
});

export default function TablePaginationActions(props) {
  const { direction, page, lastPageIdx, onPageChange, keyboard, tableWidth, translator, isInSelectionMode } = props;
  const isRTL = direction === 'rtl';
  const onFirstPage = page === 0;
  const onLastPage = page >= lastPageIdx;
  const tabIndex = !keyboard.enabled || keyboard.active ? 0 : -1;
  const showFirstLast = tableWidth > 350;

  const handleSelectPage = (event) => onPageChange(+event.target.value);
  const handleLastButtonTab = keyboard.enabled ? (event) => handleLastTab(event, isInSelectionMode) : null;

  const getButton = (disabledCondition, pageNumber, type, onKeyDown = null) => {
    let iconType = type;
    if (isRTL) {
      if (type === 'FirstPage') {
        iconType = 'LastPage';
      } else if (type === 'PreviousPage') {
        iconType = 'NextPage';
      } else if (type === 'NextPage') {
        iconType = 'PreviousPage';
      } else if (type === 'LastPage') {
        iconType = 'FirstPage';
      }
    }
    const IconComponent = icons[iconType];
    return (
      <PaginationActionIconButton
        data-testid="pagination-action-icon-button"
        onClick={!disabledCondition ? () => onPageChange(pageNumber) : null}
        aria-disabled={disabledCondition}
        aria-label={translator.get(`SNTable.Pagination.${type}`)}
        title={translator.get(`SNTable.Pagination.${type}`)}
        tabIndex={tabIndex}
        disabledCondition={disabledCondition}
        onKeyDown={onKeyDown}
      >
        <IconComponent />
      </PaginationActionIconButton>
    );
  };

  return (
    <TablePaginationActionsSection>
      {tableWidth > 650 && (
        <CustomFormControl>
          <Caption htmlFor="pagination-dropdown" shrink={false}>
            {`${translator.get('SNTable.Pagination.SelectPage')}:`}
          </Caption>
          <PaginationSelect
            native
            value={page}
            onChange={handleSelectPage}
            inputProps={{
              'data-testid': 'pagination-dropdown',
              tabIndex,
              id: 'pagination-dropdown',
              style: {
                paddingTop: '3px',
                paddingBottom: '3px',
              },
            }}
          >
            {Array(lastPageIdx + 1)
              .fill()
              .map((_, i) => (
                <option key={_} value={i}>
                  {i + 1}
                </option>
              ))}
          </PaginationSelect>
        </CustomFormControl>
      )}
      {showFirstLast && getButton(onFirstPage, 0, 'FirstPage')}
      {getButton(onFirstPage, page - 1, 'PreviousPage')}
      {getButton(onLastPage, page + 1, 'NextPage', !showFirstLast ? handleLastButtonTab : null)}
      {showFirstLast && getButton(onLastPage, lastPageIdx, 'LastPage', handleLastButtonTab)}
    </TablePaginationActionsSection>
  );
}

TablePaginationActions.propTypes = {
  direction: PropTypes.string.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  lastPageIdx: PropTypes.number.isRequired,
  keyboard: PropTypes.object.isRequired,
  isInSelectionMode: PropTypes.bool.isRequired,
  tableWidth: PropTypes.number.isRequired,
  translator: PropTypes.object.isRequired,
};
