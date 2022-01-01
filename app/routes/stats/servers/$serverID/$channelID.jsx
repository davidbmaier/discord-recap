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
            <Link to={`/stats/servers/${serverID}`}>Back to server</Link>
            <Row>
              <Tile flex={3}>
                <MessageCount
                  messageCount={stats.messageCount}
                  wordCount={stats.wordCount}
                  characterCount={stats.characterCount}
                  firstMessage={stats.firstMessage}
                />
              </Tile>
              <Tile flex={2}>
                <FirstMessage
                  message={stats.firstMessage}
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
          </>
        )
      }
    </div>
  );
}
