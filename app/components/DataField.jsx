/* eslint-disable react/no-danger -- all instances come from internal data and are needed for formatting */
import React from 'react';
import PropTypes from 'prop-types';

const DataField = (props) => {
  const {
    valueText, subtitle, value, icon,
  } = props;

  const isValid = () => {
    let invalid = false;
    if (Array.isArray(value)) {
      invalid = value.some((v) => v === '' || v === 0 || v === null || v === undefined || Number.isNaN(v) || v === false);
    } else {
      invalid = value === '' || value === 0 || value === null || value === undefined || Number.isNaN(value) || value === false;
    }
    return !invalid;
  };

  return (
    <div>
      {
        isValid() && (
          <div className="dr-datafield">
            <span className="dr-datafield-icon">{icon}</span>
            <span>
              <div className="dr-datafield-value">
                <h2 dangerouslySetInnerHTML={{ __html: valueText }} />
              </div>
              {subtitle && (
                <div className="dr-datafield-subtitle">
                  <h3 dangerouslySetInnerHTML={{ __html: subtitle }} />
                </div>
              )}
            </span>

          </div>
        )
      }
    </div>

  );
};

DataField.propTypes = {
  valueText: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  value: PropTypes.oneOfType(
    [
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.bool
    ],
  ),
  icon: PropTypes.node,
};

export default DataField;
