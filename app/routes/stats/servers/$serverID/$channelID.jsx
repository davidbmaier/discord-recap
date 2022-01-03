import React, { useEffect, useState } from 'react';
import { useLoaderData, Link } from 'remix';

import { getStats } from '../../../../lib/store';
import { cleanChartData } from '../../../../lib/utils';
import Row from '../../../../components/Row';
import Tile from '../../../../components/Tile';
import MessageCount from '../../../../components/MessageCount';
import FirstMessage from '../../../../components/FirstMessage';
import MessageCharts from '../../../../components/MessageCharts';
import TopWordsAndEmotes from '../../../../components/TopWordsAndEmotes';

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

      {
        stats && (
          <>
            <h1>{`#${stats.channels[0].name} (${stats.name})`}</h1>
            <Link className="dr-breadcrumb" to={`/stats/servers/${serverID}`}>Back to server</Link>
            <Row>
              <Tile flex={3}>
                <MessageCount
                  messageCount={stats.channels[0].messageCount}
                  wordCount={stats.channels[0].wordCount}
                  characterCount={stats.channels[0].characterCount}
                  firstMessage={stats.channels[0].firstMessage}
                  lastMessage={stats.lastMessage}
                  context="in this channel"
                />
              </Tile>
              <Tile flex={2}>
                <FirstMessage
                  message={stats.channels[0].firstMessage}
                  context="in this channel"
                />
              </Tile>
            </Row>
            <Row>
              <Tile flex={4}>
                <MessageCharts
                  messageCountPerDay={cleanChartData(stats.channels[0].messageCountPerDay)}
                  messageCountPerHour={cleanChartData(stats.channels[0].messageCountPerHour)}
                  messageCountPerYear={cleanChartData(stats.channels[0].messageCountPerYear)}
                />
              </Tile>
            </Row>
            <TopWordsAndEmotes topWords={stats.channels[0].topWords} topEmotes={stats.channels[0].topEmotes} />
          </>
        )
      }
    </div>
  );
}
