const statsID = 'stats';

export const storeStats = (stats) => {
  localStorage.setItem(statsID, JSON.stringify(stats));
};

export const getStats = () => localStorage.getItem(statsID);

export const clearStats = () => localStorage.removeItem(statsID);
