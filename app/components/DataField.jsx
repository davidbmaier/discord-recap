/* eslint-disable react/no-danger -- all instances come from internal data and are needed for formatting */
import React from 'react';
import PropTypes from 'prop-types';

const DataField = (props) => {
  const { valueText, subtitle, value } = props;

  const isValid = () => {
    let invalid = false;
    if (Array.isArray(value)) {
      invalid = value.some((v) => v === '' || v === 0 || v === null || v === undefined || Number.isNaN(v));
    } else {
      invalid = value === '' || value === 0 || value === null || value === undefined || Number.isNaN(value);
    }
    return !invalid;
  };

  // TODO: add icon prop
  return (
    <div>
      {
        isValid() && (
          <div className="dr-datafield">
            <div className="dr-datafield-value">
              <h2 dangerouslySetInnerHTML={{ __html: valueText }} />
            </div>
            { subtitle && (
            <div className="dr-datafield-subtitle">
              <h3 dangerouslySetInnerHTML={{ __html: subtitle }} />
            </div>
            )}
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
    ],
  ),
};

export default DataField;
