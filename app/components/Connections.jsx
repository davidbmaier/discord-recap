import React from 'react';
import PropTypes from 'prop-types';

const Connections = (props) => {
  const { connections } = props;

  return (
    <div className="dr-connections">
      {
        connections.map((connection) => (
          <div key={connection.type}>
            <div>
              {`${connection.type}: ${connection.name}` }
            </div>
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
