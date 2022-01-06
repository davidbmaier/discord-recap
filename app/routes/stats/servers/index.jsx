import React, { useEffect, useState } from 'react';

import { MdGroups } from 'react-icons/md';
import { BiFoodMenu } from 'react-icons/bi';

import { getStats } from '../../../lib/store';
import { cleanChartData, usePlural, formatNumber } from '../../../lib/utils';
import TopList from '../../../components/TopList';
import Row from '../../../components/Row';
import Tile from '../../../components/Tile';
import DataField from '../../../components/DataField';
import MessageCount from '../../../components/MessageCount';
import FirstMessage from '../../../components/FirstMessage';
import MessageCharts from '../../../components/MessageCharts';
import TopWordsAndEmotes from '../../../components/TopWordsAndEmotes';
import BreadcrumbWrapper from '../../../components/BreadcrumbWrapper';

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
      unknown: server.unknown,
    })).sort(({ count: value1 }, { count: value2 }) => value2 - value1);
    setStats(serverStats);
  }, []);

  return (
    <div>
      <h1>Your servers</h1>
      <BreadcrumbWrapper
        breadcrumbText="Back to stats"
        breadcrumbLink="/stats"
      />
      { stats && (
        <>
          <Row>
            <Tile flex={3}>
              <DataField
                valueText={`You're a member of <b>${formatNumber(stats.count)}</b> ${usePlural('server', stats.count)}.`}
                subtitle={`Seems like you've muted <b>${formatNumber(stats.mutedCount)}</b>
                  ${usePlural('server', stats.mutedCount)} - that includes ones you're not in anymore.`}
                value={stats.count}
                icon={<MdGroups />}
              />
              <DataField
                valueText={`In total, you've spoken in <b>${formatNumber(stats.channelCount)}</b> ${usePlural('channel', stats.channelCount)}.`}
                value={stats.channelCount}
                icon={<BiFoodMenu />}
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
                showChannel
                showServer
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
