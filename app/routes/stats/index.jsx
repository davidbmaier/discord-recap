/* eslint-disable max-len -- message fields just need extra length */
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'remix';

import { IoNotificationsOutline, IoWarningOutline, IoGameControllerOutline } from 'react-icons/io5';
import {
  AiOutlineEdit, AiOutlineDelete, AiOutlineExport, AiTwotoneCalendar, AiOutlineEye,
} from 'react-icons/ai';
import {
  BsEmojiSmile, BsDoorOpen, BsWindow, BsSearch, BsMegaphone, BsPerson, BsUpload,
} from 'react-icons/bs';
import {
  MdPlusOne, MdSaveAlt, MdOutlineDarkMode, MdOutlineKeyboard, MdOutlineUpdate, MdGroups,
} from 'react-icons/md';
import { GoMention } from 'react-icons/go';
import { BiFoodMenu } from 'react-icons/bi';
import { FaDollarSign, FaRegUser } from 'react-icons/fa';
import { VscReport, VscError } from 'react-icons/vsc';
import { FiMonitor } from 'react-icons/fi';

import { getStats } from '../../lib/store';
import { cleanChartData, usePlural, formatNumber } from '../../lib/utils';
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
  const { shareable } = useOutletContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then((storedStats) => {
      const globalStats = JSON.parse(storedStats);
      // remove message details since they're not needed
      delete globalStats.messageStats.directMessages;
      delete globalStats.messageStats.serverMessages;
      setStats(globalStats);
    });
  }, []);

  const getMessageDataFields = () => {
    let messages = [
      {
        text: `Overall, you pinged <b>${formatNumber(stats.messageStats.mentionCount)}</b>
          ${usePlural('person, role or channel', stats.messageStats.mentionCount, 'people, roles and channels')}.`,
        value: stats.messageStats.mentionCount,
        icon: <GoMention />,
      },
      {
        text: [
          `Message wasn't perfect? You edited your messages <b>${formatNumber(stats.eventStats.messageEdited)}</b> ${usePlural('time', stats.eventStats.messageEdited)}.`,
          `That's <b>${formatNumber((stats.eventStats.messageEdited / stats.messageStats.messageCount) * 100)}%</b> of your messages.`,
        ],
        value: stats.eventStats.messageEdited,
        icon: <AiOutlineEdit />,
      },
      {
        text: `Oops, looks like you deleted <b>${formatNumber(stats.eventStats.messageDeleted)}</b> of your messages.`,
        value: stats.eventStats.messageDeleted,
        icon: <AiOutlineDelete />,
      },
      {
        text: [
          `A fan of emotes? You used a total of <b>${formatNumber(stats.messageStats.emoteCount)}</b> in your messages.`,
          `That's one every <b>${Math.floor((stats.messageStats.messageCount / stats.messageStats.emoteCount) * 100) / 100}</b> messages.`,
        ],
        value: stats.messageStats.emoteCount,
        icon: <BsEmojiSmile />,
      },
      {
        text: [
          `Or do you prefer default emoji? You used a total of <b>${formatNumber(stats.messageStats.emojiCount)}</b> of those.`,
          `That's one every <b>${Math.floor((stats.messageStats.messageCount / stats.messageStats.emojiCount) * 100) / 100}</b> messages.`,
        ],
        value: stats.messageStats.emojiCount,
        icon: <AiOutlineEye />,
      },
      {
        text: `Reactions are a different story - you used <b>${formatNumber(stats.eventStats.reactionAdded)}</b> of those.`,
        value: stats.eventStats.reactionAdded,
        icon: <MdPlusOne />,
      },
      {
        text: `You opened <b>${formatNumber(stats.eventStats.inviteOpened)}</b>
          ${usePlural('invite', stats.eventStats.inviteOpened)}, and sent out <b>${formatNumber(stats.eventStats.inviteSent)}</b> of your own.`,
        value: [
          stats.eventStats.inviteOpened, stats.eventStats.inviteSent,
        ],
        icon: <BsDoorOpen />,
      },
    ];

    if (!shareable) {
      messages = messages.concat([
        {
          text: [
            `Sometimes everyone runs out of space: You ran into the message length limit <b>${formatNumber(stats.eventStats.messageLengthLimitReached)}</b>
            ${usePlural('time', stats.eventStats.messageLengthLimitReached)}.`,
            `There's also a limit for reactions - you reached that one <b>${formatNumber(stats.eventStats.reactionLimitReached)}</b>
            ${usePlural('time', stats.eventStats.reactionLimitReached)}.`,
          ],
          value: stats.eventStats.messageLengthLimitReached,
          icon: <IoWarningOutline />,
        },
        {
          text: `Threads are still fairly new - you joined <b>${formatNumber(stats.eventStats.threadJoined)}</b> of those.`,
          value: stats.eventStats.threadJoined,
          icon: <AiOutlineExport />,
        },
        {
          text: `See something you like? You saved <b>${formatNumber(stats.eventStats.imageSaved)}</b> ${usePlural('image', stats.eventStats.imageSaved)} in Discord.`,
          value: stats.eventStats.imageSaved,
          icon: <MdSaveAlt />,
        },
      ]);
    }

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
    let messages = [
      {
        text: stats.darkMode
          ? 'A <b>dark mode</b> connoisseur - unofficial stats say you\'re in the vast majority!'
          : 'A <b>light mode</b> user - that\'s pretty rare!',
        value: 'true', // no value check needed
        icon: <MdOutlineDarkMode />,
      },
      {
        text: `You uploaded a total of <b>${formatNumber(stats.filesUploaded)}</b> files to Discord. That's a lot of memes!`,
        value: stats.filesUploaded,
        icon: <BsUpload />,
      },
      {
        text: `You opened Discord <b>${formatNumber(stats.eventStats.appOpened)}</b> ${usePlural('time', stats.eventStats.appOpened)}.`,
        value: stats.eventStats.appOpened,
        icon: <BsWindow />,
      },
      {
        text: `Who rang? You clicked <b>${formatNumber(stats.eventStats.notificationClicked)}</b> ${usePlural('notification', stats.eventStats.notificationClicked)}.`,
        value: stats.eventStats.notificationClicked,
        icon: <IoNotificationsOutline />,
      },
      {
        text: `Any chance you're a famous streamer? You toggled streamer mode <b>${formatNumber(stats.eventStats.streamerModeToggled)}</b>
          ${usePlural('time', stats.eventStats.streamerModeToggled)}.`,
        value: stats.eventStats.streamerModeToggled,
        icon: <FiMonitor />,
      },
      {
        text: `A gamer, eh? Discord detected <b>${formatNumber(stats.eventStats.gameLaunched)}</b> game
          ${usePlural('launch', stats.eventStats.gameLaunched, 'launches')}.`,
        value: stats.eventStats.gameLaunched,
        icon: <IoGameControllerOutline />,
      },
      {
        text: [
          `Gotta stay up to date: You switched avatars <b>${formatNumber(stats.eventStats.avatarUpdated)}</b>
            ${usePlural('time', stats.eventStats.avatarUpdated)}.`,
          `Same thing goes for your status: <b>${formatNumber(stats.eventStats.statusUpdated)}</b> ${usePlural('update', stats.eventStats.statusUpdated)}.`,
        ],
        value: stats.eventStats.avatarUpdated,
        icon: <MdOutlineUpdate />,
      },
      {
        text: `Uh-oh! Looks like Discord ran into <b>${formatNumber(stats.eventStats.errorDetected)}</b>
          ${usePlural('error or crash', stats.eventStats.errorDetected, 'errors or crashes')} for you.`,
        value: stats.eventStats.errorDetected,
        icon: <VscError />,
      },
      {
        text: `Overall, Discord tried to sell you something <b>${formatNumber(stats.eventStats.promotionShown)}</b>
          ${usePlural('time', stats.eventStats.promotionShown)}.`,
        value: stats.eventStats.promotionShown,
        icon: <BsMegaphone />,
      },
    ];

    if (!shareable) {
      messages = messages.concat([
        {
          text: `Looking for something? You started <b>${formatNumber(stats.eventStats.searchStarted)}</b> ${usePlural('search', stats.eventStats.searchStarted, 'searches')}.`,
          value: stats.eventStats.searchStarted,
          icon: <BsSearch />,
        },
        {
          text: `Seems like you know your way around! You used <b>${formatNumber(stats.eventStats.keyboardShortcutUsed)}</b> keyboard
          ${usePlural('shortcut', stats.eventStats.keyboardShortcutUsed)}.`,
          value: stats.eventStats.keyboardShortcutUsed,
          icon: <MdOutlineKeyboard />,
        },
        {
          text: `Thanks for keeping an eye out and reporting <b>${formatNumber(stats.eventStats.messageReported)}</b>
          ${usePlural('message', stats.eventStats.messageReported)} and <b>${formatNumber(stats.eventStats.userReported)}</b>
          ${usePlural('user', stats.eventStats.userReported)}.`,
          value: stats.eventStats.messageReported,
          icon: <VscReport />,
        },
        {
          text: `In total, you spent <b>$${formatNumber(stats.totalPaymentAmount / 100)}</b> on Discord.`,
          value: 'true', // no value check needed, 0 is worth showing
          icon: <FaDollarSign />,
        },
        {
          text: `Based on their analytics, Discord thinks you're <b>${stats.eventStats.predictedAge?.predicted_age}</b> years old and <b>${stats.eventStats.predictedGender?.predicted_gender}</b>.`,
          value: Object.prototype.hasOwnProperty.call(stats.eventStats, 'predictedAge') && Object.prototype.hasOwnProperty.call(stats.eventStats, 'predictedGender'),
          icon: <FaRegUser />
        }
      ]);
    }

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
              <Tile flex={2}>
                <UserTile
                  userID={stats.userID}
                  userTag={stats.userTag}
                />
              </Tile>
              <Tile flex={3}>
                <FirstMessage
                  message={stats.messageStats.firstMessage}
                  context="across all of Discord"
                  showChannel
                  showServer
                />
              </Tile>
              <Tile flex={1}>
                <Connections
                  connections={stats.connections}
                />
              </Tile>
            </Row>
            {
              // don't show links in screenshot
              !shareable && (
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
                  <Tile flex={1}>
                    <SectionLink title="Review your yearly stats!" link="/stats/years" icon={<AiTwotoneCalendar />} />
                  </Tile>
                </Row>
              )
            }
            <Row>
              <Tile flex={3}>
                {getMessageDataFields()}
              </Tile>
              <Tile flex={3}>
                {getMetaDataFields()}
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
            <TopWordsAndEmotes topWords={stats.messageStats.topWords} topEmotes={stats.messageStats.topEmotes} shareable={shareable} />
            {
              shareable && (
                <div className="dr-footer">
                  <span>
                    {'Get your own detailed Discord stats at '}
                    <b>discord-recap.com</b>
                    !
                  </span>
                  <span>
                    {'Made by '}
                    <b>David B. Maier</b>
                  </span>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
}
