const MB_IN_BYTES = 1000 * 1000; // 1 MB in bytes

export const PLANS = {
  basic: {
    id: null,
    name: "Basic",
    rowLimit: 100,
    monthlySessions: 50,
    storageLimit: 10 * MB_IN_BYTES, // 10 MB
    dailyAiTokenLimit: 25000,
  },
  pro: {
    name: "Pro",
    rowLimit: 1000,
    monthlySessions: 500,
    storageLimit: 100 * MB_IN_BYTES, // 100 MB
    dailyAiTokenLimit: 250000,
  },
};
