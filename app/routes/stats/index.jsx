/* eslint-disable max-len -- message fields just need extra length */
import React, { useEffect, useState } from 'react';

import { IoNotificationsOutline, IoWarningOutline, IoGameControllerOutline } from 'react-icons/io5';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineExport } from 'react-icons/ai';
import {
  BsEmojiSmile, BsDoorOpen, BsWindow, BsSearch, BsMegaphone, BsPerson,
} from 'react-icons/bs';
import {
  MdPlusOne, MdSaveAlt, MdOutlineDarkMode, MdOutlineKeyboard, MdOutlineUpdate, MdGroups,
} from 'react-icons/md';
import { GoMention } from 'react-icons/go';
import { HiOutlinePhone } from 'react-icons/hi';
import { BiUserVoice, BiFoodMenu } from 'react-icons/bi';
import { FaDollarSign } from 'react-icons/fa';
import { VscReport, VscError } from 'react-icons/vsc';
import { FiMonitor } from 'react-icons/fi';

import { getStats } from '../../lib/store';
import { cleanChartData, usePlural } from '../../lib/utils';
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
        text: `Overall, you pinged <b>${stats.messageStats.mentionCount}</b>
          ${usePlural('person, role or channel', stats.messageStats.mentionCount, 'people, roles and channels')}.`,
        value: stats.messageStats.mentionCount,
        icon: <GoMention />,
      },
      {
        text: `Message wasn't perfect? You edited your messages <b>${stats.eventStats.messageEdited}</b> ${usePlural('time', stats.eventStats.messageEdited)}.`,
        value: stats.eventStats.messageEdited,
        icon: <AiOutlineEdit />,
      },
      {
        text: `Oops, looks like you deleted <b>${stats.eventStats.messageDeleted}</b> of your messages.`,
        value: stats.eventStats.messageDeleted,
        icon: <AiOutlineDelete />,
      },
      {
        text: `A fan of emotes? You used a total of <b>${stats.messageStats.emoteCount}</b> in your messages.`,
        value: stats.messageStats.emoteCount,
        icon: <BsEmojiSmile />,
      },
      {
        text: `Reactions are a different story - you used <b>${stats.eventStats.reactionAdded}</b> of those.`,
        value: stats.eventStats.reactionAdded,
        icon: <MdPlusOne />,
      },
      {
        text: `You opened <b>${stats.eventStats.inviteOpened}</b>
          ${usePlural('invite', stats.eventStats.inviteOpened)}, and sent out <b>${stats.eventStats.inviteSent}</b> of your own.`,
        value: [
          stats.eventStats.inviteOpened, stats.eventStats.inviteSent,
        ],
        icon: <BsDoorOpen />,
      },
      {
        text: [
          `Sometimes everyone runs out of space: You ran into the message length limit <b>${stats.eventStats.messageLengthLimitReached}</b>
            ${usePlural('time', stats.eventStats.messageLengthLimitReached)}.`,
          `There's also a limit for reactions - you reached that one <b>${stats.eventStats.reactionLimitReached}</b>
            ${usePlural('time', stats.eventStats.reactionLimitReached)}.`,
        ],
        value: stats.eventStats.messageLengthLimitReached,
        icon: <IoWarningOutline />,
      },
      {
        text: [
          `Threads are still fairly new - you joined <b>${stats.eventStats.threadJoined}</b> of those.`,
          `And you used <b>${stats.eventStats.slashCommandUsed}</b> slash ${usePlural('command', stats.eventStats.slashCommandUsed)}.`,
        ],
        value: stats.eventStats.threadJoined,
        icon: <AiOutlineExport />,
      },
      {
        text: `See something you like? You saved <b>${stats.eventStats.imageSaved}</b> ${usePlural('image', stats.eventStats.imageSaved)} in Discord.`,
        value: stats.eventStats.imageSaved,
        icon: <MdSaveAlt />,
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
            return <DataField valueText={message.text[0]} subtitle={message.text[1]} key={message.text[0]} value={message.value} icon={message.icon} />;
          }
          return <DataField valueText={message.text} key={message.text} value={message.value} icon={message.icon} />;
        })}
      </>
    );
  };

  const getMetaDataFields = () => {
    const messages = [
      {
        text: `You joined a voice channel <b>${stats.eventStats.voiceChannelJoined}</b> ${usePlural('time', stats.eventStats.voiceChannelJoined)}.`,
        value: stats.eventStats.voiceChannelJoined,
        icon: <HiOutlinePhone />,
      },
      {
        text: `Overall, you started talking <b>${stats.eventStats.startedSpeaking}</b> ${usePlural('time', stats.eventStats.startedSpeaking)}.`,
        value: stats.eventStats.startedSpeaking,
        icon: <BiUserVoice />,
      },
      {
        text: stats.darkMode
          ? 'A <b>dark mode</b> connoisseur - unofficial stats say you\'re in the vast majority!'
          : 'A <b>light mode</b> user - that\'s pretty rare!',
        value: 'true', // no value check needed
        icon: <MdOutlineDarkMode />,
      },
      {
        text: `In total, you spent <b>$${stats.totalPaymentAmount / 100}</b> on Discord.`,
        value: 'true', // no value check needed, 0 is worth showing
        icon: <FaDollarSign />,
      },
      {
        text: `You opened Discord <b>${stats.eventStats.appOpened}</b> ${usePlural('time', stats.eventStats.appOpened)}.`,
        value: stats.eventStats.appOpened,
        icon: <BsWindow />,
      },
      {
        text: `Who rang? You clicked <b>${stats.eventStats.notificationClicked}</b> ${usePlural('notification', stats.eventStats.notificationClicked)}.`,
        value: stats.eventStats.notificationClicked,
        icon: <IoNotificationsOutline />,
      },
      {
        text: `Looking for something? You started <b>${stats.eventStats.searchStarted}</b> ${usePlural('search', stats.eventStats.searchStarted, 'searches')}.`,
        value: stats.eventStats.searchStarted,
        icon: <BsSearch />,
      },
      {
        text: `Seems like you know your way around! You used <b>${stats.eventStats.keyboardShortcutUsed}</b> keyboard
          ${usePlural('shortcut', stats.eventStats.keyboardShortcutUsed)}.`,
        value: stats.eventStats.keyboardShortcutUsed,
        icon: <MdOutlineKeyboard />,
      },
      {
        text: `Thanks for keeping an eye out and reporting <b>${stats.eventStats.messageReported}</b>
          ${usePlural('message', stats.eventStats.messageReported)} and <b>${stats.eventStats.userReported}</b>
          ${usePlural('user', stats.eventStats.userReported)}.`,
        value: stats.eventStats.messageReported,
        icon: <VscReport />,
      },
      {
        text: `Any chance you're a famous streamer? You toggled streamer mode <b>${stats.eventStats.streamerModeToggled}</b>
          ${usePlural('time', stats.eventStats.streamerModeToggled)}.`,
        value: stats.eventStats.streamerModeToggled,
        icon: <FiMonitor />,
      },
      {
        text: `A gamer, eh? Discord detected <b>${stats.eventStats.gameLaunched}</b> game ${usePlural('launch', stats.eventStats.gameLaunched, 'launches')}.`,
        value: stats.eventStats.gameLaunched,
        icon: <IoGameControllerOutline />,
      },
      {
        text: [
          `Gotta stay up to date: You switched avatars <b>${stats.eventStats.avatarUpdated}</b> ${usePlural('time', stats.eventStats.avatarUpdated)}.`,
          `Same thing goes for your status: <b>${stats.eventStats.statusUpdated}</b> ${usePlural('update', stats.eventStats.statusUpdated)}.`,
        ],
        value: stats.eventStats.avatarUpdated,
        icon: <MdOutlineUpdate />,
      },
      {
        text: `Uh-oh! Looks like Discord ran into <b>${stats.eventStats.errorDetected}</b>
          ${usePlural('error or crash', stats.eventStats.errorDetected, 'errors or crashes')} for you.`,
        value: stats.eventStats.errorDetected,
        icon: <VscError />,
      },
      {
        text: `And overall, Discord tried to sell you something <b>${stats.eventStats.promotionShown}</b> ${usePlural('time', stats.eventStats.promotionShown)}.`,
        value: stats.eventStats.promotionShown,
        icon: <BsMegaphone />,
      },
    ];

    return (
      <>
        {messages.map((message) => {
          if (Array.isArray(message.text)) {
            return <DataField valueText={message.text[0]} subtitle={message.text[1]} key={message.text[0]} value={message.value} icon={message.icon} />;
          }
          return <DataField valueText={message.text} key={message.text} value={message.value} icon={message.icon} />;
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
                <SectionLink title="Explore your DMs!" link="/stats/dms" icon={<BsPerson />} />
              </Tile>
              <Tile flex={1}>
                <SectionLink title="Dig through your servers!" link="/stats/servers" icon={<MdGroups />} />
              </Tile>
              <Tile flex={1}>
                <SectionLink title="Check out your top channels!" link="/stats/channels" icon={<BiFoodMenu />} />
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
