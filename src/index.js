import '../styles/Variables.scss'; // Import any styles as this includes them in the build.
import '../styles/init.scss'; // Import any styles as this includes them in the build.

import WelcomeApplication from '~/src/components/pages/WelcomeApplication.js';
import { MODULE_ID } from '~/src/helpers/constants';
import { log } from '~/src/helpers/utility';
import { registerSettings } from '~/src/settings';
import jsPDF from 'jspdf';

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

Hooks.on("getJournalSheetHeaderButtons", (app, buttons) => {

  log.d('app', app);
  buttons.unshift({
    label: "Make PDF",
    class: "make-pdf",
    icon: "fas fa-file-pdf",
    onclick: () => {
      Hooks.call("makePDF", app.object.uuid);
    }
  });

  return buttons;
});


Hooks.on("makePDF", (uuid) => {

  const journal = fromUuidSync(uuid);

  const pages = journal.collections.pages.entries();
  let content = '<div id="pdf">';
  for (const page of pages) {
    log.d('page', page)
    content += `<h1 class="title">${page[1].name}</h1>` + page[1].text.content ;
  }
  content += '</div>';
  log.d('content', content);
  const pdf = new jsPDF('p', 'pt', 'a4');

  pdf.html(content, {
    callback: function (doc) {
      pdf.save(`${journal.name}.pdf`);
    },
    autoPaging: 'text',
    jsPDF: pdf,
    windowWidth: 600,
    width: 600
  });
});

