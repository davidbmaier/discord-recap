import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'remix';

import { getStats } from '../../../lib/store';

export const loader = async ({ params }) => params.userID;

export default function Server() {
  const userID = useLoaderData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const userStats = globalStats.messageStats.directMessages.channels.find((channel) => channel.userID === userID);
    setStats(userStats);
  }, []);

  return (
    <div>
      <h1>specific user</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
