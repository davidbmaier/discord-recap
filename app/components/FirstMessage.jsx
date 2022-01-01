import React from 'react';
import PropTypes from 'prop-types';

import { emoteRegex } from '../lib/constants';
import Emote from './Emote';

const FirstMessage = (props) => {
  const { message, context } = props;

  const formatDate = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',

    });
  };

  const formatMessage = (content) => {
    let fragmentIndex = 0;
    const emoteMatches = content.matchAll(emoteRegex);
    const formattedMessageFragments = [];
    let startIndex = 0;
    // eslint-disable-next-line no-restricted-syntax -- matchAll returns an iterator
    for (const emoteMatch of emoteMatches) {
      // add the text before the emote
      formattedMessageFragments.push(content.substring(startIndex, emoteMatch.index));
      formattedMessageFragments.push(<Emote key={`dr-firstmessage-fragment${fragmentIndex}`} id={emoteMatch[4]} name={emoteMatch[2]} />);
      startIndex = emoteMatch.index + emoteMatch[0].length;
      fragmentIndex += 1;
    }
    // add the remaining message
    formattedMessageFragments.push(content.substr(startIndex));

    // replace \n with real linebreaks
    const formattedMessageFragmentsWithLineBreaks = formattedMessageFragments.map((fragment) => {
      if (typeof fragment === 'string') {
        const lines = fragment.split('\n');
        const linesWithBreaks = [];
        lines.forEach((line, index) => {
          if (index === lines.length - 1) {
            linesWithBreaks.push(line);
          } else {
            linesWithBreaks.push(line);
            linesWithBreaks.push(<br key={fragmentIndex} />);
            fragmentIndex += 1;
          }
        });
        return linesWithBreaks;
      }
      return fragment;
    }).flat();

    return formattedMessageFragmentsWithLineBreaks;
  };

  return (
    <div className="dr-firstmessage">
      <h2>
        {`Your first message${context ? ` ${context}` : ''}:`}
      </h2>
      <div className="dr-firstmessage-content">
        {formatMessage(message.content).map((messageFragment) => messageFragment)}
      </div>
      <div>
        {`Sent on ${formatDate(message.date)}`}
      </div>
    </div>
  );
};

FirstMessage.propTypes = {
  message: PropTypes.shape({
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    channel: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  context: PropTypes.string.isRequired,
};

export default FirstMessage;
