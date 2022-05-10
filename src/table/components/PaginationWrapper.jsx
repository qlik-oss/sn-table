import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';

const Portal = ({ children, target }) => ReactDOM.createPortal(children, target);

export default function PaginationWrapper({ children, theme, footerContainer }) {
  const paperTablePaginationStyle = {
    height: '40px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 1,
    backgroundColor: theme.table.backgroundColor,
    boxShadow: 'none',
    borderStyle: 'solid',
    borderWidth: '0px 0px 1px 0px',
    borderRadius: 0,
    borderColor: theme.table.pagination.borderColor,
  };

  return footerContainer ? (
    <Portal target={footerContainer}>{children}</Portal>
  ) : (
    <Paper sx={paperTablePaginationStyle}>{children}</Paper>
  );
}

PaginationWrapper.defaultProps = {
  footerContainer: null,
};

PaginationWrapper.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  footerContainer: PropTypes.object,
};
