module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  setupFiles: ["./setupJest.js"],
};
