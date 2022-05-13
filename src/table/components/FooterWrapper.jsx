import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';

export default function FooterWrapper({ children, theme, footerContainer }) {
  const paperTablePaginationStyle = {
    height: 48,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 1,
    boxShadow: 'none',
    borderStyle: 'solid',
    borderWidth: '0px 0px 1px 0px',
    borderRadius: 0,
    borderColor: theme.table.pagination.borderColor,
    color: theme.table.pagination.color,
    backgroundColor: theme.table.backgroundColor,
  };

  return footerContainer ? (
    ReactDOM.createPortal(children, footerContainer)
  ) : (
    <Paper sx={paperTablePaginationStyle}>{children}</Paper>
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
