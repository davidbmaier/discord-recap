/* eslint-disable react/no-danger -- all instances come from internal data and are needed for formatting */
import React from 'react';
import PropTypes from 'prop-types';

import DataField from './DataField';

const MessageCount = (props) => {
  const {
    messageCount, wordCount, characterCount, firstMessage,
  } = props;

  const getAverageMessageCountPerDay = () => {
    const daysSinceFirstMessage = (Date.now() - new Date(firstMessage.date).getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor((messageCount / daysSinceFirstMessage) * 100) / 100;
  };

  return (
    <div className="dr-messagecount">
      <DataField
        valueText={`You have sent <b>${messageCount}</b> messages.`}
        subtitle={`That's about <b>${getAverageMessageCountPerDay()} messages per day</b> since your first one.`}
      />
      <DataField
        valueText={`You wrote <b>${wordCount}</b> words.`}
      />
      <DataField
        valueText={`That's a total of <b>${characterCount}</b> characters.`}
      />
    </div>
  );
};

MessageCount.propTypes = {
  messageCount: PropTypes.number.isRequired,
  wordCount: PropTypes.number.isRequired,
  characterCount: PropTypes.number.isRequired,
  firstMessage: PropTypes.shape({
    date: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessageCount;
