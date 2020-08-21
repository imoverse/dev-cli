const corsOptions = whitelist => ({
  origin: (origin, callback) => {
    // need this for postmann ? should be removed?
    if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not in CORS whitelist`));
    }
  },
});

module.exports = corsOptions;
