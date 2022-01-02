/* eslint-disable react/no-danger -- all instances come from internal data and are needed for formatting */
import React from 'react';
import PropTypes from 'prop-types';

import { TiMessages } from 'react-icons/ti';
import { BiBook } from 'react-icons/bi';
import { BsFileText } from 'react-icons/bs';

import DataField from './DataField';
import { usePlural } from '../lib/utils';

const MessageCount = (props) => {
  const {
    messageCount, wordCount, characterCount, firstMessage, lastMessage, context,
  } = props;

  const getAverageMessageCountPerDay = () => {
    const daysSinceFirstMessage = (Date.now() - new Date(firstMessage.date).getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceLastMessage = (Date.now() - new Date(lastMessage.date).getTime()) / (1000 * 60 * 60 * 24);
    const daysBetweenMessages = daysSinceFirstMessage - daysSinceLastMessage;
    return Math.floor((messageCount / daysBetweenMessages) * 100) / 100;
  };

  return (
    <div className="dr-messagecount">
      <DataField
        valueText={`You have sent <b>${messageCount}</b>
          ${usePlural('message', messageCount)}${context ? ` ${context}` : ''}.`}
        subtitle={`That's about <b>${getAverageMessageCountPerDay()}</b>
          ${usePlural('message', getAverageMessageCountPerDay())} per day between your first and your latest one.`}
        value={messageCount}
        icon={<TiMessages />}
      />
      <DataField
        valueText={`You wrote <b>${wordCount}</b> ${usePlural('word', wordCount)}.`}
        value={wordCount}
        icon={<BiBook />}
      />
      <DataField
        valueText={`That's a total of <b>${characterCount}</b> ${usePlural('character', characterCount)}.`}
        value={characterCount}
        icon={<BsFileText />}
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
  lastMessage: PropTypes.shape({
    date: PropTypes.string.isRequired,
  }).isRequired,
  context: PropTypes.string.isRequired,
};

export default MessageCount;
