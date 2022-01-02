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
      {
        text: `Overall, you pinged <b>${stats.messageStats.mentionCount}</b> people, roles and channels.`,
        value: stats.messageStats.mentionCount,
      },
      {
        text: `Message wasn't perfect? You edited your messages <b>${stats.eventStats.messageEdited}</b> times.`,
        value: stats.eventStats.messageEdited,
      },
      {
        text: `Oops, looks like you deleted <b>${stats.eventStats.messageDeleted}</b> of your messages.`,
        value: stats.eventStats.messageDeleted,
      },
      {
        text: `A fan of emotes? You used a total of <b>${stats.messageStats.emoteCount}</b> in your messages.`,
        value: stats.messageStats.emoteCount,
      },
      {
        text: `Reactions are a different story - you used <b>${stats.eventStats.reactionAdded}</b> of those.`,
        value: stats.eventStats.reactionAdded,
      },
      {
        text: `You opened <b>${stats.eventStats.inviteOpened}</b> invites, and sent out <b>${stats.eventStats.inviteSent}</b> of your own.`,
        value: [
          stats.eventStats.inviteOpened, stats.eventStats.inviteSent,
        ],
      },
      {
        text: [
          `Sometimes everyone runs out of space: You ran into the message length limit <b>${stats.eventStats.messageLengthLimitReached}</b> times.`,
          `There's also a limit for reactions - you reached that one <b>${stats.eventStats.reactionLimitReached}</b> times.`,
        ],
        value: stats.eventStats.messageLengthLimitReached,
      },
      {
        text: [
          `Threads are still fairly new - you joined <b>${stats.eventStats.threadJoined}</b> of those.`,
          `And you used <b>${stats.eventStats.slashCommandUsed}</b> slash commands.`,
        ],
        value: stats.eventStats.threadJoined,
      },
      {
        text: `See something you like? You saved <b>${stats.eventStats.imageSaved}</b> images in Discord.`,
        value: stats.eventStats.imageSaved,
      },

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
          if (Array.isArray(message.text)) {
            return <DataField valueText={message.text[0]} subtitle={message.text[1]} key={message.text[0]} value={message.value} />;
          }
          return <DataField valueText={message.text} key={message.text} value={message.value} />;
        })}
      </>
    );
  };

  const getMetaDataFields = () => {
    const messages = [
      {
        text: `You joined a voice channel <b>${stats.eventStats.voiceChannelJoined}</b> times.`,
        value: stats.eventStats.voiceChannelJoined,
      },
      {
        text: `Overall, you started talking <b>${stats.eventStats.startedSpeaking}</b> times.`,
        value: stats.eventStats.startedSpeaking,
      },
      {
        text: stats.darkMode
          ? 'A <b>dark mode</b> connoisseur - unofficial stats say you\'re in the vast majority!'
          : 'A <b>light mode</b> user - that\'s pretty rare!',
        value: 'true', // no value check needed
      },
      {
        text: `In total, you spent <b>$${stats.totalPaymentAmount / 100}</b> on Discord.`,
        value: 'true', // no value check needed, 0 is worth showing
      },
      {
        text: `You opened Discord <b>${stats.eventStats.appOpened}</b> times.`,
        value: stats.eventStats.appOpened,
      },
      {
        text: `Who rang? You clicked <b>${stats.eventStats.notificationClicked}</b> notifications.`,
        value: stats.eventStats.notificationClicked,
      },
      {
        text: `Looking for something? You started <b>${stats.eventStats.searchStarted}</b> searches.`,
        value: stats.eventStats.searchStarted,
      },
      {
        text: `Seems like you know your way around! You used <b>${stats.eventStats.keyboardShortcutUsed}</b> keyboard shortcuts.`,
        value: stats.eventStats.keyboardShortcutUsed,
      },
      {
        text: `Thanks for keeping an eye out and reporting <b>${stats.eventStats.messageReported}</b> messages and <b>${stats.eventStats.userReported}</b> users.`,
        value: stats.eventStats.messageReported,
      },
      {
        text: `Any chance you're a famous streamer? You toggled streamer mode <b>${stats.eventStats.streamerModeToggled}</b> times.`,
        value: stats.eventStats.streamerModeToggled,
      },
      {
        text: `A gamer, eh? Discord detected <b>${stats.eventStats.gameLaunched}</b> game launches.`,
        value: stats.eventStats.gameLaunched,
      },
      {
        text: [
          `Gotta stay up to date: You switched avatars <b>${stats.eventStats.avatarUpdated}</b> times.`,
          `Same thing goes for your status: <b>${stats.eventStats.statusUpdated}</b> updates.`,
        ],
        value: stats.eventStats.avatarUpdated,
      },
      {
        text: `Uh-oh! Looks like Discord ran into <b>${stats.eventStats.errorDetected}</b> errors or crashes for you.`,
        value: stats.eventStats.errorDetected,
      },
      {
        text: `And overall, Discord tried to sell you something <b>${stats.eventStats.promotionShown}</b> times.`,
        value: stats.eventStats.promotionShown,
      },
    ];

    return (
      <>
        {messages.map((message) => {
          if (Array.isArray(message.text)) {
            return <DataField valueText={message.text[0]} subtitle={message.text[1]} key={message.text[0]} value={message.value} />;
          }
          return <DataField valueText={message.text} key={message.text} value={message.value} />;
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
                <SectionLink title="Check out your top channels!" link="/stats/channels" />
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
