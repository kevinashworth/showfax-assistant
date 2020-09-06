import { browser, Tabs, WebRequest } from 'webextension-polyfill-ts';
import log from 'loglevel';
import { onError } from '../helpers';

log.setLevel('debug');
const onInstalledHandler = (details: any): void => {
  // log.debug('Showfax Assistant installed:');
  // log.debug(JSON.stringify(details, null, 2));
  if (details.reason === 'install') {
    browser.storage.local.set({ change_showfax_titles: true });
    browser.storage.local.set({ add_showfax_dropdowns: true });
    log.info('Thank you for installing', browser.runtime.getManifest().name);
  } else if (details.reason === 'update') {
    const thisVersion = browser.runtime.getManifest().version;
    log.info('Updating', browser.runtime.getManifest().name, 'from', details.previousVersion, 'to', thisVersion);
  }
}
browser.runtime.onInstalled.addListener(onInstalledHandler);

const onMessageHandler = (message: any): void => {
  console.log('Background/index onMessageHandler:');
  console.log(JSON.stringify(message, null, 2));
}
browser.runtime.onMessage.addListener(onMessageHandler);

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    log.debug('tab:', tab);
    browser.tabs.sendMessage(
      tab.id,
      {
        greeting: 'Hi from Showfax Assistant Background/index',
        command: 'runThisThing'
      }
    ).then(response => {
      log.debug('Message probably from content script:');
      log.debug(response.response);
    }).catch((e) => onError(e, 'sendMessageToTabs'));
  }
}

browser.tabs.query({
  currentWindow: true,
  active: true
}).then(sendMessageToTabs).catch(onError);
