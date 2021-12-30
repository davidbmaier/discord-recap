import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'remix';

import { getStats } from '../../../../../lib/store';

export const loader = async ({ params }) => ({ serverID: params.serverID, channelID: params.channelID });

export default function ServerChannel() {
  const { serverID, channelID } = useLoaderData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const serverStats = globalStats.messageStats.serverMessages.servers.find((server) => server.id === serverID);
    serverStats.channels = [serverStats.channels.find((channel) => channel.id === channelID)];
    setStats(serverStats);
  }, []);

  return (
    <div>
      <h1>specific channel in server</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
