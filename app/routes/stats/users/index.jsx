import React, { useEffect, useState } from 'react';

import { getStats } from '../../../lib/store';

export default function Servers() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const userStats = globalStats.messageStats.directMessages;
    userStats.channels = userStats.channels.map((channel) => ({
      id: channel.id, userID: channel.userID, messageCount: channel.messageCount, name: channel.name,
    }));
    setStats(userStats);
  }, []);

  return (
    <div>
      <h1>list of users</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
