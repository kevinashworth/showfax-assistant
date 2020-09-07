import { browser } from 'webextension-polyfill-ts';
import log from 'loglevel';
import { onError, sleep } from '../helpers';

export const firstPassForRegionResults = async () => {
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
    const categorySelectorUL = <HTMLUListElement>document.querySelector('select[name="categoryValue"] ~ ul');
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

export const secondPassForSortedResults = async () => {
  const targetResultsLoading = <HTMLElement>document.getElementById('results_loading');
  if (!targetResultsLoading.classList.contains('hidden')) {
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