import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'remix';

import { getStats } from '../../../../lib/store';

export const loader = async ({ params }) => params.serverID;

export default function Server() {
  const serverID = useLoaderData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const serverStats = globalStats.messageStats.serverMessages.servers.find((server) => server.id === serverID);
    delete serverStats.channels;
    setStats(serverStats);
  }, []);

  return (
    <div>
      <h1>specific server</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
