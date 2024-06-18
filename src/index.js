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
  new WelcomeApplication().render(true, { focus: true });
});


Hooks.on("makePDF", (application) => {

  const journal = fromUuidSync("JournalEntry.iwkRT6IGoKgE8zw7");

  const pages = journal.collections.pages.entries();
  let content = '';
  for (const page of pages) {
    content += page[1].text.content
  }
  
  const pdf = new jsPDF('p', 'pt', 'a4');

  pdf.html(content, {
    callback: function (doc) {
      pdf.save('myfile.pdf');
    },
    autoPaging: 'text',
    jsPDF: pdf,
    windowWidth: 1000,
    width: 1000
  });
});