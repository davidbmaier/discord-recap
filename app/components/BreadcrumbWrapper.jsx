import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'remix';

const BreadcrumbWrapper = (props) => {
  const {
    breadcrumbText, breadcrumbLink, onFilter, validOptions, currentSelection,
  } = props;

  return (
    <div className="dr-breadcrumb-wrapper">
      <span>
        <Link className="dr-breadcrumb" to={breadcrumbLink}>{breadcrumbText}</Link>
      </span>
      <span>
        { onFilter && (
          <>
            <span>Filter by year:</span>
            <select id="dr-yearselect" value={currentSelection || ''} onChange={(e) => onFilter(e.target.value)}>
              {validOptions.map((validYear) => (
                <option key={validYear}>{validYear}</option>
              ))}
            </select>
          </>
        )}
      </span>
    </div>
  );
};

BreadcrumbWrapper.propTypes = {
  breadcrumbText: PropTypes.string.isRequired,
  breadcrumbLink: PropTypes.string.isRequired,
  onFilter: PropTypes.func,
  validOptions: PropTypes.arrayOf(PropTypes.string),
  currentSelection: PropTypes.string,
};

export default BreadcrumbWrapper;
