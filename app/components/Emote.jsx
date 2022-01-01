import React from 'react';
import PropTypes from 'prop-types';

const Emote = (props) => {
  const { id, name, size = 22 } = props;

  return (
    <img className="dr-emote" height={size} src={`https://cdn.discordapp.com/emojis/${id}`} alt={`Emote: ${name}`} />
  );
};

Emote.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Emote;
