const appName = process.env.APP_NAME || "sms-api";

const config = {
  appName,
  port: process.env.PORT || 3000,
  outputDir: `${__dirname.replace('app/config', 'logs')}/`,
  nexmoKey: process.env.NEXMO_KEY,
  nexmoSecret: process.env.NEXMO_SECRET
};

module.exports = config;
