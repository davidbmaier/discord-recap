import React, { useEffect, useState } from 'react';
import { useLoaderData, Link } from 'remix';

import { getStats } from '../../../../lib/store';
import { cleanChartData } from '../../../../lib/stats/utils';
import Row from '../../../../components/Row';
import Tile from '../../../../components/Tile';
import MessageCount from '../../../../components/MessageCount';
import FirstMessage from '../../../../components/FirstMessage';
import MessageCharts from '../../../../components/MessageCharts';
import TopWordsAndEmotes from '../../../../components/TopWordsAndEmotes';
import TopList from '../../../../components/TopList';

export const loader = async ({ params }) => params.serverID;

export default function Server() {
  const serverID = useLoaderData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const serverStats = globalStats.messageStats.serverMessages.servers.find((server) => server.id === serverID);
    serverStats.channels = serverStats.channels.map((channel) => ({
      name: `${channel.name}`,
      id: channel.id,
      value: `${channel.messageCount} messages`,
      count: channel.messageCount,
      link: `/stats/servers/${serverID}/${channel.id}`,
    })).sort(({ count: value1 }, { count: value2 }) => value2 - value1);
    setStats(serverStats);
  }, []);

  return (
    <div>
      {
        stats && (
          <>
            <h1>{stats.name}</h1>
            <Link to="/stats/servers">Back to servers</Link>
            <Row>
              <Tile flex={3}>
                <MessageCount
                  messageCount={stats.messageCount}
                  wordCount={stats.wordCount}
                  characterCount={stats.characterCount}
                  firstMessage={stats.firstMessage}
                  lastMessage={stats.lastMessage}
                  context="in this server"
                />
              </Tile>
              <Tile flex={2}>
                <FirstMessage
                  message={stats.firstMessage}
                  context="in this server"
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
                  title="Top Channels"
                  items={stats.channels}
                  open
                />
              </Tile>
            </Row>
          </>
        )
      }
    </div>
  );
}
