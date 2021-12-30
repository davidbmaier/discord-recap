import React, { useEffect, useState } from 'react';

import { getStats } from '../../../lib/store';

export default function Channels() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const channelData = globalStats.messageStats.serverMessages.servers.map((server) => {
      const channels = server.channels.map((channel) => ({
        name: channel.name,
        id: channel.id,
        messageCount: channel.messageCount,
        serverID: server.id,
        serverName: server.name,
      }));
      return channels;
    }).flat();
    setStats(channelData);
  }, []);

  return (
    <div>
      <h1>list of channels</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
