import React from 'react';
import PropTypes from 'prop-types';

const UserTile = (props) => {
  const { userTag } = props;

  return (
    <div className="dr-usertile">
      <h1>{userTag}</h1>
    </div>
  );
};

UserTile.propTypes = {
  userTag: PropTypes.string.isRequired,
};

export default UserTile;
