export const storeStats = (identifier, stats) => {
  localStorage.setItem(identifier, JSON.stringify(stats));
};

export const getStats = (identifier) => localStorage.getItem(identifier);
