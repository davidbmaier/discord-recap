import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'remix';
import emojiRegex from 'emoji-regex';

import { GrCircleQuestion } from 'react-icons/gr';

import Accordion from './Accordion';
import Emote from './Emote';
import Tooltip from './Tooltip';

const sortOptions = [
  { key: `countDesc`, label: `Message count (descending)` },
  { key: `countAsc`, label: `Message count (ascending)` },
  { key: `latestDesc`, label: `Latest message sent (newest first)` },
  { key: `latestAsc`, label: `Latest message sent (oldest first)` },
  { key: `firstDesc`, label: `First message sent (newest first)` },
  { key: `firstAsc`, label: `First message sent (oldest first)` },
];

const TopList = (props) => {
  const {
    title, tooltip, items, onToggle, open, ignoreEmoji, expandable, sortable
  } = props;

  const [contentRef, setContentRef] = useState(null);
  const [sortMode, setSortMode] = useState(`countDesc`);
  const [sortedItems, setSortedItems] = useState([]);

  useEffect(() => {
    if (contentRef) {
      if (open) {
        contentRef.setAttribute('style', `max-height: ${items.length * 35}px`);
      } else {
        contentRef.setAttribute('style', 'max-height: 0px');
      }
    }
  }, [open, contentRef, items]);

  useEffect(() => {
    setSortedItems(items);
  }, [items])

  const onAccordionRefChange = (ref) => {
    setContentRef(ref);
  };

  const getName = (name) => {
    if (ignoreEmoji && name.match(emojiRegex())) {
      return '';
    }
    return name;
  };

  const onSort = (newSortMode) => {
    if (newSortMode === sortMode) {
      return;
    }

    const itemsToBeSorted = [...items];
    setSortMode(newSortMode);

    switch (newSortMode) {
      case `countDesc`:
        setSortedItems(itemsToBeSorted);
        break;
      case `countAsc`:
        setSortedItems(itemsToBeSorted.reverse());
        break;
      case `latestDesc`:
        itemsToBeSorted.sort((channelA, channelB) => {
          return new Date(channelB.lastMessage?.date || 0) - new Date(channelA.lastMessage?.date || 0)
        })
        setSortedItems(itemsToBeSorted);
        break;
      case `latestAsc`:
        itemsToBeSorted.sort((channelA, channelB) => {
          return new Date(channelA.lastMessage?.date || 0) - new Date(channelB.lastMessage?.date || 0)
        })
        setSortedItems(itemsToBeSorted);
        break;
      case `firstDesc`:
        itemsToBeSorted.sort((channelA, channelB) => {
          return new Date(channelB.firstMessage?.date || 0) - new Date(channelA.firstMessage?.date || 0)
        })
        setSortedItems(itemsToBeSorted);
        break;
      case `firstAsc`:
        itemsToBeSorted.sort((channelA, channelB) => {
          return new Date(channelA.firstMessage?.date || 0) - new Date(channelB.firstMessage?.date || 0)
        })
        setSortedItems(itemsToBeSorted);
        break;
      default:
        break;
    }
  }

  return (
    <div className={expandable ? 'dr-toplist dr-toplist-expandable' : 'dr-toplist'}>
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
              sortedItems.map((item, index) => (
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
                        ? <Link className="dr-toplist-item-name" to={item.link}>{getName(item.name)}</Link>
                        : (
                          <span className="dr-toplist-item-name">
                            {getName(item.name)}
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
        sortable={sortable}
        sortOptions={sortOptions}
        onSort={onSort}
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
  ignoreEmoji: PropTypes.bool,
  expandable: PropTypes.bool,
  sortable: PropTypes.bool,
};

export default TopList;
