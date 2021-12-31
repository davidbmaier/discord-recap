import React from 'react';
import PropTypes from 'prop-types';

const Connections = (props) => {
  const {
    header, content, onToggle, open,
  } = props;

  return (
    <div className="dr-accordion">
      <div className="dr-accordion-header">
        {header}
      </div>
      {
        open && (
          <div className="dr-accordion-content">
            {content}
          </div>
        )
      }
      <button
        type="button"
        onClick={() => onToggle()}
      >
        {open ? 'Hide' : 'Show all'}
      </button>
    </div>
  );
};

Connections.propTypes = {
  header: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  onToggle: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

export default Connections;
