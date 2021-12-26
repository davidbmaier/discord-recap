import { readFile } from "./extract";

export const collectStats = async (files) => {
    const globalStats = await collectGlobalStats(files);
    return globalStats;
};

// global information about the account (to be shown on the main stats page)
const collectGlobalStats = async (files) => {
    const userData = JSON.parse(await readFile(files, "account/user.json"));

    const stats = {
        id: userData.id,
        tag: `${userData.username}#${userData.discriminator}`,
        darkMode: userData.settings.settings.appearance.theme === "DARK",
        connections: null,
        messageCount: null,
        wordCount: null,
        characterCount: null,
        firstMessage: null,
        topWords: null,
        topEmotes: null,
        reactionCount: null,
        editCount: null,
        replyCount: null, // might not exist
        deleteCount: null,
        mentionCount: null,
        emoteCount: null,
        slashCommandCount: null,
        directMessageCount: null,
        serverCount: null,
        channelCount: null,
        notificationClickCount: null,
        openDiscordCount: null,
        voiceChannelsJoinedCount: null,
        directVoiceCallsCount: null,
        firstVoiceCall: null,
        messageCountPerHour:null,
        messageCountPerDay:null,
        messageCountPerYear:null,
    };

    return stats;
};

const collectStatsForAllDMs = async (files) => {
    const stats = {
        userCount: null,
        friendCount: null,
        blockCount: null,
        noteCount: null,
        messageCount: null,
        wordCount: null,
        characterCount: null,
        firstMessage: null,
        topWords: null,
        topEmotes: null,
        messageCountPerHour:null,
        messageCountPerDay:null,
        messageCountPerYear:null,
        directMessages: null, // array of dm stats objects
    };
};

const collectStatsForDM = async (files, dmID) => {
    const stats = {
        id: dmID,
        userTag: null,
        userID: null,
        messageCount: null,
        wordCount: null,
        characterCount: null,
        firstMessage: null,
        topWords: null,
        topEmotes: null,
        messageCountPerHour:null,
        messageCountPerDay:null,
        messageCountPerYear:null,
    };
};

const collectStatsForAllServers = async (files) => {
    const stats = {
        count: null,
        mutedCount: null,
        ownedCount: null,
        channelCount: null,
        messageCount: null,
        wordCount: null,
        characterCount: null,
        firstMessage: null,
        topWords: null,
        topEmotes: null,
        messageCountPerHour:null,
        messageCountPerDay:null,
        messageCountPerYear:null,
    };
};

const collectStatsForServer = async (files, serverID) => {
    const stats = {
        id: serverID,
        name: null,
        serverID: null,
        serverName: null,
        channelCount: null,
        messageCount: null,
        wordCount: null,
        characterCount: null,
        firstMessage: null,
        topWords: null,
        topEmotes: null,
        messageCountPerHour:null,
        messageCountPerDay:null,
        messageCountPerYear:null,
    };
};

const collectStatsForAllChannels = async (files) => {
    const stats = {
        messageCount: null,
        wordCount: null,
        characterCount: null,
        firstMessage: null,
        topWords: null,
        topEmotes: null,
        messageCountPerHour:null,
        messageCountPerDay:null,
        messageCountPerYear:null,
    };
};

const collectStatsForChannel = async (files, channelID) => {
    const stats = {
        id: channelID,
        name: null,
        serverID: null,
        messageCount: null,
        wordCount: null,
        characterCount: null,
        firstMessage: null,
        topWords: null,
        topEmotes: null,
        messageCountPerHour:null,
        messageCountPerDay:null,
        messageCountPerYear:null,
    };
};
