import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { StyledFooterWrapper } from './styles';
import { FooterWrapperProps } from '../../types';
import { getPaginationStyle } from '../../utils/styling-utils';

export default function FooterWrapper({ children, theme, footerContainer }: FooterWrapperProps) {
  const paginationStyle = useMemo(() => getPaginationStyle(theme.background), [theme]);

  return footerContainer ? (
    ReactDOM.createPortal(children, footerContainer)
  ) : (
    <StyledFooterWrapper paginationStyle={paginationStyle}>{children}</StyledFooterWrapper>
  );
}
