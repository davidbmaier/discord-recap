import React, { useEffect, useState } from 'react';
import { Link } from 'remix';

import TopList from '../../../components/TopList';
import Row from '../../../components/Row';
import Tile from '../../../components/Tile';
import { getStats } from '../../../lib/store';

export default function Channels() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const channelData = globalStats.messageStats.serverMessages.servers.map((server) => {
      const channels = server.channels.map((channel) => ({
        name: `${channel.name} (${server.name})`,
        id: channel.id,
        value: `${channel.messageCount} messages`,
        count: channel.messageCount,
        link: `/stats/servers/${server.id}/${channel.id}`,
      }));
      return channels;
    }).flat().sort(({ count: value1 }, { count: value2 }) => value2 - value1);
    setStats(channelData);
  }, []);

  return (
    <div>
      <h1>Your channels</h1>
      <Link className="dr-breadcrumb" to="/stats">Back to Stats</Link>
      { stats && (
        <Row>
          <Tile flex={1}>
            <TopList
              title="Top Channels"
              items={stats}
              open
            />
          </Tile>
        </Row>
      )}
    </div>
  );
}
