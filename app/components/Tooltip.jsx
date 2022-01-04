import React from 'react';
import PropTypes from 'prop-types';

const Tooltip = (props) => {
  const { icon, text, side } = props;

  const getClassNames = () => {
    let classNames = 'dr-tooltip-text';
    if (side === 'left') {
      classNames += ' dr-tooltip-left';
    } else {
      classNames += ' dr-tooltip-right';
    }
    return classNames;
  };

  return (
    <span className="dr-tooltip">
      {icon}
      <span className={getClassNames()}>{text}</span>
    </span>
  );
};

Tooltip.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  side: PropTypes.oneOf(['left', 'right']),
};

export default Tooltip;
