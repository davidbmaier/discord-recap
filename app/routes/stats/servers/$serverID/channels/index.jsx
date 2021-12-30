import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'remix';

import { getStats } from '../../../../../lib/store';

export const loader = async ({ params }) => params.serverID;

export default function ServerChannels() {
  const serverID = useLoaderData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const serverStats = globalStats.messageStats.serverMessages.servers.find((server) => server.id === serverID);
    setStats(serverStats);
  }, []);

  return (
    <div>
      <h1>list of server channels</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
