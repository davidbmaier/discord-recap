import React, { useEffect, useState } from 'react';
import { Link } from 'remix';

import { BsPerson } from 'react-icons/bs';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdOutlineBlock } from 'react-icons/md';

import { getStats } from '../../../lib/store';
import { cleanChartData, usePlural, formatNumber } from '../../../lib/utils';
import TopList from '../../../components/TopList';
import Row from '../../../components/Row';
import Tile from '../../../components/Tile';
import DataField from '../../../components/DataField';
import FirstMessage from '../../../components/FirstMessage';
import MessageCount from '../../../components/MessageCount';
import MessageCharts from '../../../components/MessageCharts';
import TopWordsAndEmotes from '../../../components/TopWordsAndEmotes';

export default function DMs() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const userStats = globalStats.messageStats.directMessages;
    userStats.channels = userStats.channels.map((channel) => ({
      name: `${channel.name}`,
      id: channel.id,
      value: `${channel.messageCount} messages`,
      count: channel.messageCount,
      link: `/stats/dms/${channel.id}`,
      unknown: channel.unknown,
    })).sort(({ count: value1 }, { count: value2 }) => value2 - value1);
    setStats(userStats);
  }, []);

  return (
    <div>
      <h1>Your DMs</h1>
      <Link className="dr-breadcrumb" to="/stats">Back to Stats</Link>
      {
        stats && (
          <>
            <Row>
              <Tile flex={3}>
                <DataField
                  valueText={`You've talked in <b>${formatNumber(stats.count)}</b> ${usePlural('DM', stats.count, 'different DMs')}.`}
                  subtitle={`<b>${formatNumber(stats.userCount)}</b> of those were individual users.`}
                  value={stats.count}
                  icon={<BsPerson />}
                />
                <DataField
                  valueText={`In total, you made <b>${formatNumber(stats.friendCount)}</b> ${usePlural('friend', stats.friendCount)}.`}
                  value={stats.friendCount}
                  icon={<AiOutlineUsergroupAdd />}
                />
                <DataField
                  valueText={`But you also blocked <b>${formatNumber(stats.blockedCount)}</b> ${usePlural('person', stats.friendCount, 'people')}.`}
                  value={stats.blockedCount}
                  icon={<MdOutlineBlock />}
                />
              </Tile>
              <Tile flex={3}>
                <MessageCount
                  messageCount={stats.messageCount}
                  wordCount={stats.wordCount}
                  characterCount={stats.characterCount}
                  firstMessage={stats.firstMessage}
                  lastMessage={stats.lastMessage}
                  context="across all your DMs"
                />
              </Tile>
              <Tile flex={2}>
                <FirstMessage
                  message={stats.firstMessage}
                  context="across all your DMs"
                  showChannel
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
              <Tile flex={3}>
                <TopList
                  title="Top DMs"
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
