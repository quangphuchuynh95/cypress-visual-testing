const path = require("path");
module.exports = {
  apps: [
    {
      name: "backend",
      interpreter: '/bin/sh',
      cwd: path.join(__dirname, 'apps/backend'),
      script: './node_modules/.bin/nest',
      args: 'start',
    }
  ]
}
