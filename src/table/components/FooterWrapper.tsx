import React from 'react';
import ReactDOM from 'react-dom';
import { StyledFooterWrapper } from '../styles';
import { FooterWrapperProps } from '../../types';

export default function FooterWrapper({ children, theme, footerContainer }: FooterWrapperProps) {
  return footerContainer ? (
    ReactDOM.createPortal(children, footerContainer)
  ) : (
    <StyledFooterWrapper tableTheme={theme.table}>{children}</StyledFooterWrapper>
  );
}
