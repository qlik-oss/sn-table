import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import { TableContext, useContextSelector } from "../../context";
import { FooterWrapperProps } from "../../types";
import { getFooterStyle } from "../../utils/styling-utils";
import { StyledFooterWrapper } from "./styles";

export default function FooterWrapper({ children, footerContainer, paginationNeeded = true }: FooterWrapperProps) {
  const { theme } = useContextSelector(TableContext, (value) => value.baseProps);
  const footerStyle = useMemo(() => getFooterStyle(theme.background), [theme]);

  const pagination = paginationNeeded ? (
    <StyledFooterWrapper footerStyle={footerStyle}>{children}</StyledFooterWrapper>
  ) : null;

  return footerContainer ? ReactDOM.createPortal(children, footerContainer) : pagination;
}
