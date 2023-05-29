import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { FooterWrapperProps } from '../types';
import { getFooterStyle } from '../utils/styling-utils';
import { useContextSelector, TableContext } from '../context';
import PaginationContent from '../../table-commons/footer/PaginationContent';

import { PAGINATION_HEIGHT } from '../constants';

const StyledFooterWrapper = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== 'footerStyle',
})(({ footerStyle, theme }) => ({
  height: PAGINATION_HEIGHT,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(0, 1, 0, 1),
  color: footerStyle.color,
  background: footerStyle.background,
  borderTop: `1px solid ${footerStyle.borderColor}`,
}));

export default function FooterWrapper(props: FooterWrapperProps) {
  const { footerContainer } = props;
  const {
    keyboard,
    translator,
    theme: { background },
    constraints,
    rect,
  } = useContextSelector(TableContext, (value) => value.baseProps);
  const tableData = useContextSelector(TableContext, (value) => value.tableData);
  const footerStyle = useMemo(() => getFooterStyle(background), [background]);

  const paginationContent = (
    <PaginationContent
      {...props}
      tableData={tableData}
      keyboard={keyboard}
      translator={translator}
      background={background}
      constraints={constraints}
      rect={rect}
    />
  );

  if (footerContainer) {
    return ReactDOM.createPortal(paginationContent, footerContainer);
  }

  return tableData.paginationNeeded ? (
    <StyledFooterWrapper footerStyle={footerStyle}>{paginationContent}</StyledFooterWrapper>
  ) : null;
}
