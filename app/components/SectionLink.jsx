/* eslint-disable react/no-danger -- all instances come from internal data and are needed for formatting */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'remix';

const DataField = (props) => {
  const { title, link, icon } = props;

  return (
    <h2 className="dr-sectionlink">
      <span className="dr-sectionlink-icon">
        {icon}
      </span>
      <Link to={link}>
        {title}
      </Link>
    </h2>

  );
};

DataField.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

export default DataField;
