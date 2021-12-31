import React from 'react';
import PropTypes from 'prop-types';

const Tile = (props) => {
  const { children, flex } = props;

  const getClassNames = () => {
    const classNames = ['dr-tile'];
    classNames.push(`dr-flex-${flex}`);

    return classNames.join(' ');
  };

  return (
    <div className={getClassNames()}>
      {children}
    </div>
  );
};

Tile.propTypes = {
  children: PropTypes.node.isRequired,
  flex: PropTypes.number.isRequired,
};

export default Tile;
