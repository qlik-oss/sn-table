import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { StyledFooterWrapper } from './styles';
import { FooterWrapperProps } from '../../types';
import { getFooterStyle } from '../../utils/styling-utils';
import { useContextSelector, TableContext } from '../../context';

export default function FooterWrapper({ children, footerContainer, paginationNeeded = true }: FooterWrapperProps) {
  const { theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const footerStyle = useMemo(() => getFooterStyle(theme.background), [theme]);

  const pagination = paginationNeeded ? (
    <StyledFooterWrapper footerStyle={footerStyle}>{children}</StyledFooterWrapper>
  ) : null;

  return footerContainer ? ReactDOM.createPortal(children, footerContainer) : pagination;
}
