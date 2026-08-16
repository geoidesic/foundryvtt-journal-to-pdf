import '../styles/Variables.sass'; // Import any styles as this includes them in the build.
import '../styles/init.sass'; // Import any styles as this includes them in the build.

import WelcomeApplication from '~/src/components/pages/WelcomeApplication.js';
import { MODULE_ID } from '~/src/helpers/constants';
import { log } from '~/src/helpers/utility';
import { registerSettings } from '~/src/settings';
import jsPDF from 'jspdf';

window.log = log;
log.level = log.DEBUG;

Hooks.once("init", (app, html, data) => {
  log.i('Initialising');
  // CONFIG.debug.hooks = true;
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

/**
 * ApplicationV2 journal sheets use a different render hook from ApplicationV1.
 * Keep the V1 hook above for Foundry 11-12 and register the V2 hooks only when
 * the V2 API exists, so the behaviour remains version-compatible.
 */
function addV2PdfButton(app, element) {
  const html = element?.jquery ? element[0] : element;
  if (!html?.querySelector || !app?.document) return;
  if (!html.matches?.('.journal-entry, .journal-sheet') &&
      !html.querySelector('.journal-entry-content, .journal-sidebar')) return;

  const header = html.querySelector('.window-header');
  if (!header || header.querySelector('[data-action="makePDF"]')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'header-control make-pdf';
  button.dataset.tooltip = 'JOURNAL TO PDF | Make PDF';
  button.dataset.action = 'makePDF';
  button.dataset.tooltipDirection = 'DOWN';
  button.setAttribute('aria-label', 'Make PDF');
  button.innerHTML = '<i class="fas fa-file-pdf" inert></i>';
  button.addEventListener('click', (event) => {
    event.preventDefault();
    Hooks.call("makePDF", app.document.uuid);
  });

  // ApplicationV2's titlebar hides controls after the first few actions. The
  // PDF action is still a normal header action and remains available there.
  header.insertBefore(button, header.querySelector('[data-action="close"]') || null);
}

const foundryVersion = Number(globalThis.game?.version?.split?.('.')[0]);
if (globalThis.foundry?.applications?.api?.ApplicationV2 || foundryVersion >= 13) {
  Hooks.on("renderApplication", addV2PdfButton);
  Hooks.on("renderApplicationV2", addV2PdfButton);
}


Hooks.on("makePDF", (uuid) => {

  const journal = fromUuidSync(uuid);
  if (!journal) {
    log.e('Could not find journal entry for UUID:', uuid);
    return;
  }

  // Support both V1 and V2 page access APIs
  let pages;
  if (journal.collections?.pages) {
    // V12+ API
    pages = [...journal.collections.pages.values()];
  } else if (journal.pages) {
    // V11 API (Map)
    pages = [...journal.pages.values()];
  } else {
    log.e('Could not access journal pages');
    return;
  }

  let content = '<div id="pdf">';
  for (const page of pages) {
    log.d('page', page);
    const pageName = page.name || 'Untitled Page';

    // Handle different page types - text is the most common
    let pageContent = '';
    if (page.text?.content) {
      pageContent = page.text.content;
    } else if (page.system?.text?.content) {
      pageContent = page.system.text.content;
    } else {
      // Skip non-text page types (image, video, pdf, etc.) or add a placeholder
      pageContent = `<p><em>[${page.type || 'Non-text'} page: ${pageName}]</em></p>`;
    }

    content += `<h1 class="title">${pageName}</h1>${pageContent}`;
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

