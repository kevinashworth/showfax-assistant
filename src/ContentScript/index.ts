import { browser } from 'webextension-polyfill-ts';
import { onError, sleep } from '../helpers';

const startTime = new Date().getTime();
console.log('ContentScript/index started');
window.addEventListener('load', (event) => {
  const endTime = new Date().getTime();
  console.log('Page fully loaded after', endTime - startTime, 'milliseconds');
  firstPassForRegionResults();
  secondPassForSortedResults();
});

const sendOnClick = (e: MouseEvent) => {
  console.log('sendOnClick in ContentScript/index:');
  console.log(e);
  browser.runtime.sendMessage({
    greeting: 'Click just happened'
  }).then(response => {
    console.log('Message probably from background:');
    console.log(response);
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
    console.log('there is a list, do nothing');
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
      console.log('Will now click formSearchButton');
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
    console.log('there is a list');
    const sortBySelector = <HTMLElement>document.querySelector('#results_region > div.results-header-header > div > label > div > div')
    if (sortBySelector.classList.contains('selection-selected')) {
      console.log('there is a list, it is sorted');
    } else {
      sortBySelector.click();
      const newestSelector = <HTMLElement>document.querySelector('#results_region > div.results-header-header > div > label > div > ul > li:nth-child(1)');
      newestSelector.click();
    }
  }
}

export {};
