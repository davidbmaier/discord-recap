import React from 'react';
import PropTypes from 'prop-types';

const FirstMessage = (props) => {
  const { message } = props;

  return (
    <div className="dr-firstmessage">
      Your very first message:
      <div className="dr-firstmessage-content">
        {message.content}
      </div>
      <div>
        {`Sent on ${message.date} in ${message.channel.name}`}
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
};

export default FirstMessage;
