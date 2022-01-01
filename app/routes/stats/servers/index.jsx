import React, { useEffect, useState } from 'react';
import { Link } from 'remix';

import { getStats } from '../../../lib/store';
import { cleanChartData } from '../../../lib/stats/utils';
import TopList from '../../../components/TopList';
import Row from '../../../components/Row';
import Tile from '../../../components/Tile';
import DataField from '../../../components/DataField';
import MessageCount from '../../../components/MessageCount';
import FirstMessage from '../../../components/FirstMessage';
import MessageCharts from '../../../components/MessageCharts';
import TopWordsAndEmotes from '../../../components/TopWordsAndEmotes';

export default function Servers() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const serverStats = globalStats.messageStats.serverMessages;
    serverStats.servers = serverStats.servers.map((server) => ({
      name: `${server.name}`,
      id: server.name || 'Unknown',
      value: `${server.messageCount} messages`,
      count: server.messageCount,
      link: `/stats/servers/${server.id}`,
    })).sort(({ count: value1 }, { count: value2 }) => value2 - value1);
    setStats(serverStats);
  }, []);

  return (
    <div>
      <h1>Your servers</h1>
      <Link to="/stats">Back to Stats</Link>
      { stats && (
        <>
          <Row>
            <Tile flex={3}>
              <DataField
                valueText={`You're a member of <b>${stats.count}</b> servers.`}
                subtitle={`Seems like you've muted <b>${stats.mutedCount}</b> servers - that includes ones you're not in anymore.`}
              />
              <DataField
                valueText={`In total, you've spoken in <b>${stats.channelCount}</b> channels.`}
              />
            </Tile>
            <Tile flex={3}>
              <MessageCount
                messageCount={stats.messageCount}
                wordCount={stats.wordCount}
                characterCount={stats.characterCount}
                firstMessage={stats.firstMessage}
                lastMessage={stats.lastMessage}
                context="across all your servers"
              />
            </Tile>
            <Tile flex={3}>
              <FirstMessage
                message={stats.firstMessage}
                context="across all your servers"
              />
            </Tile>
          </Row>
          <Row>
            <Tile flex={4}>
              <MessageCharts
                messageCountPerDay={cleanChartData(stats.messageCountPerDay)}
                messageCountPerHour={cleanChartData(stats.messageCountPerHour)}
                messageCountPerYear={cleanChartData(stats.messageCountPerYear)}
              />
            </Tile>
          </Row>
          <TopWordsAndEmotes topWords={stats.topWords} topEmotes={stats.topEmotes} />
          <Row>
            <Tile flex={1}>
              <TopList
                title="Top Servers"
                items={stats.servers}
                open
              />
            </Tile>
          </Row>
        </>
      )}
    </div>
  );
}
