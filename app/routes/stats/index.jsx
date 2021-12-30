import React, { useEffect, useState } from 'react';

import { getStats } from '../../lib/store';

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    // remove message details since they're not needed
    delete globalStats.messageStats.directMessages;
    delete globalStats.messageStats.serverMessages;
    setStats(globalStats);
  }, []);

  return (
    <div>
      <h1>Stats</h1>
      {
        stats && JSON.stringify(stats)
      }
    </div>
  );
}
