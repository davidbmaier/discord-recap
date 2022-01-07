import React from 'react';
import PropTypes from 'prop-types';

const Emote = (props) => {
  const { id, name, size = 22 } = props;
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
