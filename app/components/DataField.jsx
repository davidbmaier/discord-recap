/* eslint-disable react/no-danger -- all instances come from internal data and are needed for formatting */
import React from 'react';
import PropTypes from 'prop-types';

const DataField = (props) => {
  const { valueText, subtitle } = props;

  // TODO: add icon prop
  return (
    <div className="dr-datafield">
      <div className="dr-datafield-value">
        <span dangerouslySetInnerHTML={{ __html: valueText }} />
      </div>
      { subtitle && (
        <div className="dr-datafield-subtitle">
          <span dangerouslySetInnerHTML={{ __html: subtitle }} />
        </div>
      )}
    </div>
  );
};

DataField.propTypes = {
  valueText: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default DataField;
