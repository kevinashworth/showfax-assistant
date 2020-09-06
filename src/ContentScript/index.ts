import { browser } from 'webextension-polyfill-ts';
import log from 'loglevel';
import { onError, sleep } from '../helpers';

const t0 = performance.now();
log.setLevel('debug');
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
  browser.runtime.sendMessage({
    greeting: 'Click just happened'
  }).then(response => {
    log.debug('Message response:');
    log.debug(response.response);
  }).catch(onError);
}
window.addEventListener('click', sendOnClick);

browser.runtime.onMessage.addListener(request => {
  console.log('ContentScript/index onMessage:');
  console.log(request);
  if (request.command && request.command === 'runThisThing') {
    firstPassForRegionResults();
  }
  return Promise.resolve({ response: 'Hi from Showfax Assistant ContentScript/index' });
});

const firstPassForRegionResults = async () => {
  if (document.querySelectorAll('.table-div-table-body')[0].children.length) {
    log.debug('there is a list, do nothing');
  } else {
    const regionSearchButton = <HTMLButtonElement>document.querySelector('button[name="searchMethodButtons_region"]');
    if (!regionSearchButton.classList.contains('is-selected')) {
      regionSearchButton.click();
    }
    const regionSelector = <HTMLSelectElement>document.querySelector('select[name="regionValue"]');
    regionSelector.options[1].selected = true; // Los Angeles

    const categorySelector = <HTMLSelectElement>document.querySelector('select[name="categoryValue"]');
    categorySelector.options[1].selected = true; // Episodics

    const targetResultsRegion = <HTMLElement>document.getElementById('results_region');
    const formSearchButton = <HTMLInputElement>document.querySelector('input[name="regionButton"]');
    if (!targetResultsRegion || targetResultsRegion.classList.contains('hidden')) {
      log.debug('Will now click formSearchButton');
      formSearchButton.click();
    }
  }
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
}

export {};
