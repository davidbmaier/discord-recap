export const requiredFiles = [
  {
    name: `README.txt`,
    value: /README\.txt/
  },
  {
    name: `user.json in /account`,
    value: /account\/user\.json/
  },
  {
    name: `index.json in /messages`,
    value: /messages\/index\.json/
  },
  {
    name: `index.json in /servers`,
    value: /servers\/index\.json/
  },
  {
    name: `events.json in /activity`,
    value: /activity\/(analytics|tns|modeling)\/events-[0-9-of]+\.json/
  }
];

export const channelTypes = {
  textChannel: 0,
  DM: 1,
  groupDM: 3,
  newsChannel: 5,
  newsThread: 10,
  publicThread: 11,
  privateThread: 12,
};

export const relationshipTypes = {
  friend: 1,
  blocked: 2,
};

export const getBaseHours = () => {
  const baseHours = {};
  for (let i = 0; i < 24; i += 1) {
    baseHours[i] = 0;
  }
  return baseHours;
};

export const getBaseDays = () => {
  const baseDays = {};
  for (let i = 0; i < 7; i += 1) {
    baseDays[i] = 0;
  }
  return baseDays;
};

export const getBaseYears = () => {
  const baseYears = {};
  // Discord was founded in 2015
  for (let i = 2015; i < new Date().getFullYear() + 1; i += 1) {
    baseYears[i] = 0;
  }
  return baseYears;
};

export const getBaseStats = () => ({
  messageCount: 0,
  wordCount: 0,
  characterCount: 0,
  firstMessage: null,
  topWords: {},
  topEmotes: {},
  messageCountPerHour: getBaseHours(),
  messageCountPerDay: getBaseDays(),
  messageCountPerYear: getBaseYears(),
});

export const reactionEventTypes = {
  reactionAdded: 'add_reaction',
  reactionRemoved: 'remove_reaction',
  reactionLimitReached: 'reaction_limit_reached',
};
export const externalEventTypes = {
  notificationClicked: 'notification_clicked',
  appOpened: 'app_opened',
  gameLaunched: 'launch_game',
};
export const appEventTypes = {
  searchStarted: 'search_started',
  keyboardShortcutUsed: 'keyboard_shortcut_used',
  streamerModeToggled: 'streamer_mode_toggle',
  imageSaved: 'context_menu_image_saved',
  statusUpdated: 'custom_status_updated',
  avatarUpdated: 'user_avatar_updated',
  messageReported: 'message_reported',
  userReported: 'user_report_submitted',
};
export const linkEventTypes = {
  inviteOpened: 'invite_opened',
  inviteSent: 'invite_sent',
  giftSent: 'gift_code_sent',
};
export const messageEventTypes = {
  messageEdited: 'message_edited',
  messageDeleted: 'message_deleted',
  messageLengthLimitReached: 'message_length_limit_reached',
  threadJoined: 'join_thread',
  slashCommandUsed: 'slash_command_used',
};
export const voiceEventTypes = {
  voiceChannelJoined: 'join_voice_channel',
  voiceDMJoined: 'join_call',
  startedSpeaking: 'start_speaking',
};
export const promotionEventTypes = {
  premiumUpsellViewed: 'premium_upsell_viewed',
  premiumGuildUpsellViewed: 'premium_guild_upsell_viewed',
  premiumGuildPromotionOpened: 'premium_guild_promotion_opened',
  premiumPageOpened: 'premium_page_opened',
  premiumPromotionOpened: 'premium_promotion_opened',
  premiumMarketingViewed: 'premium_marketing_page_viewed',
  promotionViewed: 'promotion_viewed',
  upsellViewed: 'upsell_viewed',
  upsellClicked: 'upsell_clicked',
  outboundPromotionClicked: 'outbound_promotion_notice_clicked',
  emojiUpsellClicked: 'emoji_upsell_popout_more_emojis_opened',
  marketingPageViewed: 'mktg_page_viewed',
};
export const technicalEventTypes = {
  nativeAppCrashed: 'app_native_crash',
  appCrashed: 'app_crashed',
  exceptionThrown: 'app_exception_thrown',
};

export const eventTypes = {
  ...reactionEventTypes,
  ...externalEventTypes,
  ...appEventTypes,
  ...linkEventTypes,
  ...messageEventTypes,
  ...voiceEventTypes,
  ...promotionEventTypes,
  ...technicalEventTypes,
};

export const dataEventTypes = {
  predictedGender: 'predicted_gender',
  predictedAge: 'predicted_age'
}

export const chartTypes = {
  day: 'day',
  hour: 'hour',
  year: 'year',
};

export const dayLabels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const emoteRegex = /(<a?):(\w+):((\d{17,20})>)/g;
export const mentionRegex = /<(?:@[!&]?|#)\d+>/g;
