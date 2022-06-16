import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { StyledFooterWrapper } from '../styles';

export default function FooterWrapper({ children, theme, footerContainer }) {
  return footerContainer ? (
    ReactDOM.createPortal(children, footerContainer)
  ) : (
    <StyledFooterWrapper tableTheme={theme.table}>{children}</StyledFooterWrapper>
  );
}

FooterWrapper.defaultProps = {
  footerContainer: null,
};

FooterWrapper.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  footerContainer: PropTypes.object,
};
