import React from 'react';
import PropTypes from 'prop-types';

const Connections = (props) => {
  const { connections } = props;

  const capitalizeFirstLetter = (name) => name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="dr-connections">
      {
        connections.map((connection) => (
          <div key={connection.type} className="dr-connections-item">
            <span>
              {`${capitalizeFirstLetter(connection.type)}:`}
            </span>
            <span>
              {connection.name}
            </span>
          </div>
        ))
      }
    </div>
  );
};

Connections.propTypes = {
  connections: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

export default Connections;
