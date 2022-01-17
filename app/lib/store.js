import { get, set, del } from 'idb-keyval';

const statsID = 'stats';

export const storeStats = async (stats) => set(statsID, JSON.stringify(stats));

export const getStats = async () => {
  const localStorageData = localStorage.getItem(statsID);
  if (localStorageData) {
    return localStorageData;
  }
  return get(statsID);
};

export const clearStats = async () => {
  localStorage.removeItem(statsID);
  await del(statsID);
};
