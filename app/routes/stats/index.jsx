/* eslint-disable max-len -- message fields just need extra length */
import React, { useEffect, useState } from 'react';

import { getStats } from '../../lib/store';
import { cleanChartData } from '../../lib/stats/utils';
import Row from '../../components/Row';
import Tile from '../../components/Tile';
import DataField from '../../components/DataField';
import MessageCount from '../../components/MessageCount';
import UserTile from '../../components/UserTile';
import FirstMessage from '../../components/FirstMessage';
import Connections from '../../components/Connections';
import TopWordsAndEmotes from '../../components/TopWordsAndEmotes';
import MessageCharts from '../../components/MessageCharts';
import SectionLink from '../../components/SectionLink';

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    // remove message details since they're not needed
    delete globalStats.messageStats.directMessages;
    delete globalStats.messageStats.serverMessages;
    setStats(globalStats);
  }, []);

  const getMessageDataFields = () => {
    const messages = [
      `Overall, you pinged <b>${stats.messageStats.mentionCount}</b> people, roles and channels.`,
      `Message wasn't perfect? You edited your messages <b>${stats.eventStats.messageEdited}</b> times.`,
      `Oops, looks like you deleted <b>${stats.eventStats.messageDeleted}</b> of your messages.`,
      `A fan of emotes? You used a total of <b>${stats.messageStats.emoteCount}</b> in your messages.`,
      `Reactions are a different story - you used <b>${stats.eventStats.reactionAdded}</b> of those.`,
      `You opened <b>${stats.eventStats.inviteOpened}</b> invites, and sent out <b>${stats.eventStats.inviteSent}</b> of your own.`,
      [
        `Sometimes everyone runs out of space: You ran into the message length limit <b>${stats.eventStats.messageLengthLimitReached}</b> times.`,
        `Reactions are no different - <b>${stats.eventStats.reactionLimitReached}</b> is how often you reached that limit.`,
      ],
      [
        `Threads are still fairly new - you joined <b>${stats.eventStats.threadJoined}</b> of those.`,
        `And you used <b>${stats.eventStats.slashCommandUsed}</b> slash commands.`,
      ],
      `See something you like? You saved <b>${stats.eventStats.imageSaved}</b> images in Discord.`,
    ];

    return (
      <>
        <MessageCount
          messageCount={stats.messageStats.messageCount}
          wordCount={stats.messageStats.wordCount}
          characterCount={stats.messageStats.characterCount}
          firstMessage={stats.messageStats.firstMessage}
          lastMessage={stats.messageStats.lastMessage}
          context="across all of Discord"
        />
        {messages.map((message) => {
          if (Array.isArray(message)) {
            return <DataField valueText={message[0]} subtitle={message[1]} key={message[0]} />;
          }
          return <DataField valueText={message} key={message} />;
        })}
      </>
    );
  };

  const getMetaDataFields = () => {
    const messages = [
      `You joined a voice channel <b>${stats.eventStats.voiceChannelJoined}</b> times.`,
      `Overall, you started talking <b>${stats.eventStats.startedSpeaking}</b> times.`,
      stats.darkMode
        ? 'A <b>dark mode</b> connoisseur - unofficial stats say you\'re in the vast majority!'
        : 'A <b>light mode</b> user - that\'s pretty rare!',
      `In total, you spent <b>$${stats.totalPaymentAmount / 100}</b> on Discord.`,
      `You opened Discord <b>${stats.eventStats.appOpened}</b> times and clicked <b>${stats.eventStats.notificationClicked}</b> notifications.`,
      `Looking for something? You started <b>${stats.eventStats.searchStarted}</b> searches.`,
      `Seems like you know your way around! You used <b>${stats.eventStats.keyboardShortcutUsed}</b> keyboard shortcuts.`,
      `Thanks for keeping an eye out and reporting <b>${stats.eventStats.messageReported}</b> messages and <b>${stats.eventStats.userReported}</b> users.`,
      [
        `Any chance you're a famous streamer? You toggled streamer mode <b>${stats.eventStats.streamerModeToggled}</b> times.`,
        `Or maybe you're a pro gamer? Discord detected <b>${stats.eventStats.gameLaunched}</b> game launches.`,
      ],
      [
        `Gotta stay up to date: You switched avatars <b>${stats.eventStats.avatarUpdated}</b> times.`,
        `Same thing goes for your status: <b>${stats.eventStats.statusUpdated}</b> updates.`,
      ],
      `Uh-oh! Looks like Discord ran into <b>${stats.eventStats.errorDetected}</b> errors or crashes for you.`,
      `And overall, Discord tried to sell you something <b>${stats.eventStats.promotionShown}</b> times.`,
    ];

    return (
      <>
        {messages.map((message) => {
          if (Array.isArray(message)) {
            return <DataField valueText={message[0]} subtitle={message[1]} key={message[0]} />;
          }
          return <DataField valueText={message} key={message} />;
        })}
      </>
    );
  };

  return (
    <div>
      {
        stats && (
          <div>
            <Row>
              <Tile flex={1}>
                <UserTile
                  userID={stats.userID}
                  userTag={stats.userTag}
                />
              </Tile>
              <Tile flex={3}>
                <FirstMessage
                  message={stats.messageStats.firstMessage}
                  context="across all of Discord"
                />
              </Tile>
              <Tile flex={2}>
                <Connections
                  connections={stats.connections}
                />
              </Tile>
            </Row>
            <Row>
              <Tile flex={3}>
                {getMessageDataFields()}
              </Tile>
              <Tile flex={3}>
                {getMetaDataFields()}
              </Tile>
            </Row>
            <Row>
              <Tile flex={1}>
                <SectionLink title="Explore your DMs!" link="/stats/dms" />
              </Tile>
              <Tile flex={1}>
                <SectionLink title="Dig through your servers!" link="/stats/servers" />
              </Tile>
              <Tile flex={1}>
                <SectionLink title="Check your top channels!" link="/stats/channels" />
              </Tile>
            </Row>
            <Row>
              <Tile flex={4}>
                <MessageCharts
                  messageCountPerDay={cleanChartData(stats.messageStats.messageCountPerDay)}
                  messageCountPerHour={cleanChartData(stats.messageStats.messageCountPerHour)}
                  messageCountPerYear={cleanChartData(stats.messageStats.messageCountPerYear)}
                />
              </Tile>
            </Row>
            <TopWordsAndEmotes topWords={stats.messageStats.topWords} topEmotes={stats.messageStats.topEmotes} />
          </div>
        )
      }
    </div>
  );
}
