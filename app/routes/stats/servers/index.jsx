import React, { useEffect, useState } from 'react';

import { getStats } from '../../../lib/store';

export default function Servers() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const serverStats = globalStats.messageStats.serverMessages;
    serverStats.servers = serverStats.servers.map((server) => ({
      name: server.name, id: server.id, messageCount: server.messageCount, channelCount: server.channelCount,
    }));
    setStats(serverStats);
  }, []);

  return (
    <div>
      <h1>list of servers</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
