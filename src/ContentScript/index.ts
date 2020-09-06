import { browser } from 'webextension-polyfill-ts';
import log from 'loglevel';
import { onError, sleep } from '../helpers';

const t0 = performance.now();
log.setLevel('debug');

interface State {
  firstPass?: boolean,
  secondPass?: boolean
}

interface Message {
  type: string,
  state?: Partial<State>,
  greeting?: string
}

// This is a copy of state
let state: State = {
  firstPass: false,
  secondPass: false
}

window.addEventListener('load', (event) => {
  const t1 = performance.now();
  log.debug('Page fully loaded after', Math.round((t1 - t0 + Number.EPSILON) * 100) / 100, 'milliseconds');
  if (!state.firstPass) {
    firstPassForRegionResults();
  }
  if (!state.secondPass) {
    secondPassForSortedResults();
  }
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
// browser.runtime.onMessage.addListener(request => {
//   log.debug('ContentScript/index onMessage:');
//   log.debug(request);
//   if (request.command && request.command === 'runThisThing') {
//     firstPassForRegionResults();
//   }
//   return Promise.resolve({ response: 'Hi from Showfax Assistant ContentScript/index' });
// });

const firstPassForRegionResults = async () => {
  if (document.querySelectorAll('.table-div-table-body')[0].children.length) {
    log.debug('there is a list, do nothing');
  } else {
    const regionSearchButton = <HTMLButtonElement>document.querySelector('button[name="searchMethodButtons_region"]');
    if (!regionSearchButton.classList.contains('is-selected')) {
      regionSearchButton.click();
    }

    // Los Angeles
    const regionSelectorUL = <HTMLUListElement>document.querySelector('select[name="regionValue"] ~ ul');
    const regionSelectorLILA = <HTMLLIElement>regionSelectorUL.children[0];
    regionSelectorLILA.click();

    // Episodics
    const categorySelectorUL = <HTMLUListElement>document.querySelector('select[name="regionValue"] ~ ul');
    const categorySelectorLILA = <HTMLLIElement>categorySelectorUL.children[0];
    categorySelectorLILA.click();

    const targetResultsRegion = <HTMLElement>document.getElementById('results_region');
    const formSearchButton = <HTMLInputElement>document.querySelector('input[name="regionButton"]');
    if (!targetResultsRegion || targetResultsRegion.classList.contains('hidden')) {
      log.debug('Will now click formSearchButton');
      formSearchButton.click();
    }
  }
  browser.runtime.sendMessage({
    type: 'setState',
    state: {
      firstPass: true
    }
  }).catch(onError);
}

const secondPassForSortedResults = async () => {
  const targetResultsLoading = <HTMLElement>document.getElementById('results_loading');
  if (!targetResultsLoading.classList.contains('hidden')){
    await sleep(2000);
  }
  if (document.querySelectorAll('.table-div-table-body')[0].children.length) {
    log.debug('there is a list');
    const sortBySelector = <HTMLElement>document.querySelector('#results_region > div.results-header-header > div > label > div > div')
    if (sortBySelector.classList.contains('selection-selected')) {
      log.debug('there is a list, it is sorted');
    } else {
      sortBySelector.click();
      const newestSelector = <HTMLElement>document.querySelector('#results_region > div.results-header-header > div > label > div > ul > li:nth-child(1)');
      newestSelector.click();
    }
  }
  browser.runtime.sendMessage({
    type: 'setState',
    state: {
      secondPass: true
    }
  }).catch(onError);
}

export {};
