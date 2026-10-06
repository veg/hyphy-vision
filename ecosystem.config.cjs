// pm2 definition for vision.hyphy.org (see DEPLOY.md).
//
// The interpreter is an absolute path so that the app does not follow the
// node user's nvm default alias, which other pm2 apps on the host share.
// Override with HYPHY_VISION_NODE=/path/to/node if the installed v22 differs.
const path = require("path");
const os = require("os");

module.exports = {
  apps: [
    {
      name: "hyphy-vision",
      script: "server.js",
      cwd: __dirname,
      interpreter:
        process.env.HYPHY_VISION_NODE ||
        path.join(os.homedir(), ".nvm/versions/node/v22.11.0/bin/node"),
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};
