import { browser } from 'webextension-polyfill-ts';
import log from 'loglevel';
import { firstPassForRegionResults, secondPassForSortedResults } from './sorted-results';
import { mySubtract, onError, onStart, onStop } from '../helpers';
import type { Message, State } from '../types';

const t0 = performance.now();
log.setLevel('debug');

// This is a copy of state
let state: State = {
  firstPass: false,
  secondPass: false
}

const runOnceOnPageLoad = () => {
  const t1 = performance.now();
  log.debug('Page fully loaded after', mySubtract(t1, t0), 'milliseconds');
  if (!state.firstPass) {
    firstPassForRegionResults();
  }
  if (!state.secondPass) {
    secondPassForSortedResults();
  }
  const t2 = performance.now();
  log.debug('Page action complete after', mySubtract(t2, t0), 'milliseconds');
}

window.addEventListener('load', (event) => {
  onStart();
  runOnceOnPageLoad();
});
window.addEventListener('unload', (event) => {
  onStop();
});
const sendOnClick = (e: MouseEvent) => {
  // log.debug('sendOnClick in ContentScript/index:');
  let greeting = 'sendOnClick';
  if (e.screenX === 0 && e.screenY === 0) {
    greeting += ' (from script)';
  } else {
    greeting += ' (from user)';
    log.debug(e);
  }
  browser.runtime.sendMessage({
    type: 'greeting',
    greeting
  }).then(response => {
    log.debug('Message response:');
    log.debug(response.response);
  }).catch(onError);
}
window.addEventListener('click', sendOnClick);

const onMessageHandler = (message: Message) => {
  if (message.type === 'getState') {
    log.debug('State:', message.state);
    state = message.state;
  }
}
browser.runtime.onMessage.addListener(onMessageHandler);

export {};
