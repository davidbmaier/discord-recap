import React from 'react';
import PropTypes from 'prop-types';

const UserTile = (props) => {
  const { userID, userTag } = props;

  return (
    <div className="dr-usertile">
      <div className="dr-usertile-tag">
        {userTag}
      </div>
      <div className="dr-usertile-id">
        {userID}
      </div>
    </div>
  );
};

UserTile.propTypes = {
  userID: PropTypes.string.isRequired,
  userTag: PropTypes.string.isRequired,
};

export default UserTile;
