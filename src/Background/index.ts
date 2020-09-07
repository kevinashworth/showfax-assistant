import { browser, Tabs, WebRequest, Runtime } from 'webextension-polyfill-ts';
import log from 'loglevel';
import { onError, onStart } from '../helpers';
import type { Message, State } from '../types';

onStart();
log.setLevel('debug');

// This is the true source of state
let state: State = {
  firstPass: false,
  secondPass: false
}

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

const onMessageHandler = (message: Message, sender: Runtime.MessageSender) => {
  if (message.type === 'SIGN_CONNECT') {
    log.debug('SIGN_CONNECT');
  } else if (message.type === 'setState') {
    log.debug('State before:', state)
    state = {
      ...state,
      ...message.state
    }
    log.debug('State after:', state)
    // return Promise.resolve({ response: 'getState', state })
    return browser.tabs.sendMessage(sender.tab.id, { type: 'getState', state });
  } else if (message.type === 'greeting') {
    log.debug('Greeting:', message.greeting);
  } else {
    log.debug('Background/index onMessageHandler:');
    log.debug(JSON.stringify(message, null, 2));
  }
  // log.debug('sender:', sender);
  return Promise.resolve({ response: 'This is the response from background script' })
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
      if (response) {
        log.debug('Message probably from content script:');
        log.debug(response.response);
      }
    }).catch((e) => onError(e, 'sendMessageToTabs'));
  }
}

browser.tabs.query({
  currentWindow: true,
  active: true
}).then(sendMessageToTabs).catch((e) => onError(e, 'browser.tabs.query'));
