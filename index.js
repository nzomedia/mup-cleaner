
let _commands = require("./commands");

module.exports = {
  // (optional) Name of plugin. Defaults to name of package
  name: 'mup-cleaner',

  // Description of top-level command, shown in `mup help`
  description: 'Uninstall mup deployed application and clean.',
  commands: _commands,
  hooks: {
    // Object of hooks that
  },
  validators: {
    // Object of validators to validate the config
  },
  // (optional) Called right after the config is loaded
  prepareConfig(config) {
    // Normalize config, add env variables, etc
    return config;
  }
};