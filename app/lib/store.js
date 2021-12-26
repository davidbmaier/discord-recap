export const storeStats = (stats) => {
    localStorage.setItem(`stats`, JSON.stringify(stats));
};

export const getStats = () => {
    return localStorage.getItem(`stats`);
};
