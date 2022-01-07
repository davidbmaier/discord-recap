import React from 'react';
import PropTypes from 'prop-types';
import emojiRegex from 'emoji-regex';

const Emote = (props) => {
  const { id, name, size = 22 } = props;
  if (name.match(emojiRegex())) {
    return (
      <span className="dr-emote dr-emote-emoji" style={{ height: size }}>
        {name}
      </span>
    );
  }
  if (!id) {
    return <span style={{ width: size }} />;
  }
  return (
    <img className="dr-emote" height={size} src={`https://cdn.discordapp.com/emojis/${id}`} title={`Emote: ${name}`} alt="" />
  );
};

Emote.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Emote;
