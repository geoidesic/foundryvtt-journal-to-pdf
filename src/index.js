import '../styles/Variables.scss'; // Import any styles as this includes them in the build.
import '../styles/init.scss'; // Import any styles as this includes them in the build.

import WelcomeApplication from './app/WelcomeApplication.js';
import { MODULE_ID, LOG_PREFIX, DEFAULT_SOURCES, DEFAULT_PACKS } from '~/src/helpers/constants';
import { log } from '~/src/helpers/utility';

window.log = log;
log.level = log.DEBUG;

Hooks.once("init", (app, html, data) => {
  log.i('Initialising');
  CONFIG.debug.hooks = true;
  registerSettings(app);
});

Hooks.once("ready", (app, html, data) => {
  if (!game.modules.get(MODULE_ID).active) {
    log.w('Module is not active');
    return;
  }
  if (!game.settings.get(MODULE_ID, 'dontShowWelcome')) {
    new WelcomeApplication().render(true, { focus: true });
  }
});