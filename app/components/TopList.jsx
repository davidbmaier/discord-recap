import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'remix';

import { GrCircleQuestion } from 'react-icons/gr';

import Accordion from './Accordion';
import Emote from './Emote';
import Tooltip from './Tooltip';

const TopList = (props) => {
  const {
    title, tooltip, items, onToggle, open,
  } = props;

  const [contentRef, setContentRef] = useState(null);

  useEffect(() => {
    if (contentRef) {
      if (open) {
        contentRef.setAttribute('style', `max-height: ${items.length * 35}px`);
      } else {
        contentRef.setAttribute('style', 'max-height: 0px');
      }
    }
  }, [open, contentRef, items]);

  const onAccordionRefChange = (ref) => {
    setContentRef(ref);
  };

  return (
    <div className="dr-toplist">
      <Accordion
        headerKey={title}
        header={(
          <h2 className="dr-toplist-header">
            {title}
            {
              tooltip && (
                <span className="dr-toplist-header-tooltip">
                  <Tooltip icon={<GrCircleQuestion />} text={tooltip} />
                </span>
              )
            }
          </h2>
        )}
        content={(
          <div className="dr-toplist-content">
            {
              items.map((item, index) => (
                <div className="dr-toplist-item" key={item.id}>
                  <span className="dr-toplist-name-wrapper">
                    <span className="dr-toplist-number">
                      {item.index || index + 1}
                    </span>
                    {
                      item.icon && (
                        <Emote id={item.emoteID} name={item.name} size={24} />
                      )
                    }
                    {
                      item.link
                        ? <Link className="dr-toplist-item-name" to={item.link}>{item.name}</Link>
                        : (
                          <span className="dr-toplist-item-name">
                            {item.name}
                          </span>
                        )
                    }
                    {
                      item.unknown && (
                        <Tooltip icon={<GrCircleQuestion />} text="Either you left, or it got deleted." />
                      )
                    }
                  </span>
                  <span className="dr-toplist-item-value">
                    {item.value}
                  </span>
                </div>
              ))
            }
          </div>
        )}
        onToggle={onToggle}
        open={open}
        onRefChange={onAccordionRefChange}
      />
    </div>
  );
};

TopList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    link: PropTypes.string,
    unknown: PropTypes.bool,
  })).isRequired,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default TopList;
