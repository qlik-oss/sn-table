import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { StyledFooterWrapper } from './styles';
import { FooterWrapperProps } from '../../types';
import { getFooterStyle } from '../../utils/styling-utils';

export default function FooterWrapper({
  children,
  theme,
  footerContainer,
  paginationNeeded = true,
}: FooterWrapperProps) {
  const footerStyle = useMemo(() => getFooterStyle(theme.background), [theme]);

  const pagination = paginationNeeded ? (
    <StyledFooterWrapper footerStyle={footerStyle}>{children}</StyledFooterWrapper>
  ) : null;

  return footerContainer ? ReactDOM.createPortal(children, footerContainer) : pagination;
}
