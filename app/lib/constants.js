export const requiredFiles = [
  'README.txt',
  'account/user.json',
  'messages/index.json',
  'servers/index.json',
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
  for (let i = 2015; i < new Date().getFullYear() + 1; i += 1) {
    baseYears[i] = 0;
  }
  return baseYears;
};
