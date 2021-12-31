import React from 'react';
import PropTypes from 'prop-types';

const Row = (props) => {
  const { children } = props;

  return (
    <div className="dr-row">
      {children}
    </div>
  );
};

Row.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Row;
