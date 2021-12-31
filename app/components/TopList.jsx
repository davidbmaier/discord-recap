import React from 'react';
import PropTypes from 'prop-types';

import Accordion from './Accordion';

const TopList = (props) => {
  const {
    title, items, onToggle, open,
  } = props;

  return (
    <div className="dr-toplist">
      <Accordion
        header={(
          <div className="dr-toplist-header">
            {title}
          </div>
        )}
        content={(
          <div className="dr-toplist-content">
            {
              items.map((item) => (
                <div className="dr-toplist-item" key={item.id}>
                  <div className="dr-toplist-item-name">
                    {item.name}
                  </div>
                  <div className="dr-toplist-item-value">
                    {item.value}
                  </div>
                  {
                    item.link && (
                      <div className="dr-toplist-item-link">
                        {item.link}
                      </div>
                    )
                  }
                </div>
              ))
            }
          </div>
        )}
        onToggle={onToggle}
        open={open}
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
  })).isRequired,
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

export default TopList;
