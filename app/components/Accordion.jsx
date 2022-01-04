import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Accordion = (props) => {
  const {
    header, content, onToggle, open, headerKey, onRefChange,
  } = props;

  const accordionContent = useRef(null);
  const firstUpdate = useRef(true);
  useEffect(() => {
    // check for initial render so we don't scroll on load
    if (firstUpdate.current) {
      // also pass the ref upstream so its max-height can be set dynamically
      if (onRefChange) {
        onRefChange(accordionContent.current);
      }
      firstUpdate.current = false;
      return;
    }

    if (open) {
      setTimeout(() => {
        const toggleButton = document.getElementById(`dr-accordion-${headerKey}`);
        toggleButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [open]);

  return (
    <div className="dr-accordion" id={`dr-accordion-${headerKey}`}>
      <div className="dr-accordion-header">
        {header}
      </div>
      <div className={open ? 'dr-accordion-content' : 'dr-accordion-content dr-accordion-content-closed'} ref={accordionContent}>
        {content}
      </div>
      {
        onToggle && (
          <div className="dr-accordion-actions">
            <button
              className="dr-accordion-toggle"
              type="button"
              onClick={() => onToggle()}
            >
              {open ? 'Hide' : 'Show all'}
            </button>
          </div>

        )
      }
    </div>
  );
};

Accordion.propTypes = {
  header: PropTypes.node.isRequired,
  headerKey: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
  onRefChange: PropTypes.func,
};

export default Accordion;
