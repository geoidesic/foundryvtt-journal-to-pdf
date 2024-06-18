import { MODULE_ID, LOG_PREFIX } from '../helpers/constants';


export function registerSettings(app): void {
  console.info(`${LOG_PREFIX} | Building module settings`);

  /** World Settings */

  /** User settings */
  dontShowWelcome()

}

function dontShowWelcome() {
  game.settings.register(MODULE_ID, 'dontShowWelcome', {
    name: game.i18n.localize('foundryvtt-journal-to-pdf.Setting.DontShowWelcome.Name'),
    hint: game.i18n.localize('foundryvtt-journal-to-pdf.Setting.DontShowWelcome.Hint'),
    scope: 'user',
    config: true,
    default: false,
    type: Boolean,
  });
}
