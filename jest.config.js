// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleFileExtensions: ["js", "json"],
  // roots: [
  //   "<rootDir>/js/core/functions", 
  //   "<rootDir>/js/util",
  //   "<rootDir>/js/quests",
  //        ]
};