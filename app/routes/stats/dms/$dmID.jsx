import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'remix';

import { getStats } from '../../../lib/store';
import { cleanChartData } from '../../../lib/utils';
import Row from '../../../components/Row';
import Tile from '../../../components/Tile';
import FirstMessage from '../../../components/FirstMessage';
import MessageCount from '../../../components/MessageCount';
import MessageCharts from '../../../components/MessageCharts';
import TopWordsAndEmotes from '../../../components/TopWordsAndEmotes';
import BreadcrumbWrapper from '../../../components/BreadcrumbWrapper';

export const loader = async ({ params }) => params.dmID;

export default function DM() {
  const dmID = useLoaderData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const dmStats = globalStats.messageStats.directMessages.channels.find((channel) => channel.id === dmID);
    setStats(dmStats);
  }, []);

  return (
    <div>
      {
        stats && (
          <>
            <h1>{stats.name}</h1>
            <BreadcrumbWrapper
              breadcrumbText="Back to DMs"
              breadcrumbLink="/stats/dms"
            />
            <Row>
              <Tile flex={3}>
                <MessageCount
                  messageCount={stats.messageCount}
                  wordCount={stats.wordCount}
                  characterCount={stats.characterCount}
                  firstMessage={stats.firstMessage}
                  lastMessage={stats.lastMessage}
                  context="in this DM"
                />
              </Tile>
              <Tile flex={2}>
                <FirstMessage
                  message={stats.firstMessage}
                  context="in this DM"
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
