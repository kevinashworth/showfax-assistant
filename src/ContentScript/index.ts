import 'emoji-log';
import { browser } from 'webextension-polyfill-ts';

// let submitted = -1;

// const resultsRegion = <HTMLElement>document.getElementById('results_region');
// console.log(resultsRegion.classList);
// if (resultsRegion.classList.contains('hidden')) {
//   submitted = 0;
// }

// const regionSearchButton = <HTMLButtonElement>document.querySelector('button[name="searchMethodButtons_region"]');
// if (regionSearchButton) {
//   regionSearchButton.click();
// }

// const regionSelector = <HTMLSelectElement>document.querySelector('select[name="regionValue"]');
// regionSelector.options[1].selected = true; // Los Angeles

// const categorySelector = <HTMLSelectElement>document.querySelector('select[name="categoryValue"]');
// categorySelector.options[1].selected = true; // Episodics

// const handleMutation = function (mutationsList: MutationRecord[], observer) {
//   submitted = 1;
//   for (let mutation of mutationsList) {
//     if (mutation.type === 'attributes') {
//       console.log('resultsRegion attributes mutation:');
//       console.dir(mutation);
//     }
//     else {
//       console.log('The', mutation.attributeName, 'attribute was modified. (', mutation.type, ')');
//     }
//   }
// };

// const targetObserver = new MutationObserver(handleMutation);
// targetObserver.observe(resultsRegion, { attributes: true, childList: true });

// const form = <HTMLFormElement>document.querySelector('form');
// if (form && submitted < 1) {
//   form.submit();
// }

// // Later, you can stop observing
// // targetObserver.disconnect();

// export {};


// if (document.readyState != 'loading') console.log('DOM should be ready.')
// console.log('Hello from runContentScript');

// const observerConfigSm = {
//   attributes: true
// };

// const observerConfigLg = {
//   attributes: true,
//   childList: true,
//   subtree: true
// };

// async function runContentScript () {
//   console.log('Hello...');

//   let state = {
//     resultsContainer: false,
//     resultsLoading: false,
//     resultsRegion: false,
//     resultsQuick: false
//   }

//   var regionSearchButton = <HTMLButtonElement>document.querySelector('button[name="searchMethodButtons_region"]');
//   // var regionSearchButtonObserver = new MutationObserver(function (mutations) {
//   //   mutations.forEach(function (mutation) {
//   //     const el = mutation.target as HTMLElement;
//   //     console.log('regionSearchButtonObserver:', mutation, el);
//   //   });
//   // });
//   // regionSearchButtonObserver.observe(regionSearchButton, observerConfigLg);

//   await sleep(500);
//   console.log('...from runContentScript');

//   var targetObserver = new MutationObserver(function (mutations) {
//     mutations.forEach(function (mutation) {
//       const el = mutation.target as HTMLElement;
//       if (el.classList.contains('results-container-container') && el.classList.contains('hidden')) {
//         state = { ...state, resultsContainer: false }
//       } else if (el.classList.contains('results-container-container') && !el.classList.contains('hidden')) {
//         state = { ...state, resultsContainer: true }
//       } else if (el.classList.contains('results-none') && el.classList.contains('hidden')) {
//         state = { ...state, resultsLoading: false }
//       } else if (el.classList.contains('results-none') && !el.classList.contains('hidden')) {
//         state = { ...state, resultsLoading: true }
//       } else if (el.classList.contains('results-region') && el.classList.contains('hidden')) {
//         state = { ...state, resultsRegion: false }
//       } else if (el.classList.contains('results-region') && !el.classList.contains('hidden')) {
//         state = { ...state, resultsRegion: true }
//       } else if (el.classList.contains('results-quick') && el.classList.contains('hidden')) {
//         state = { ...state, resultsQuick: false }
//       } else if (el.classList.contains('results-quick') && !el.classList.contains('hidden')) {
//         state = { ...state, resultsQuick: true }
//       }
//     });
//     console.table(state);
//   });

//   var targetResultsContainer = <HTMLElement>document.getElementById('results_container');
//   var targetResultsLoading = <HTMLElement>document.getElementById('results_loading');
//   var targetResultsQuick = <HTMLElement>document.getElementById('results_quick');
//   var targetResultsRegion = <HTMLElement>document.getElementById('results_region');
//   console.log(targetResultsContainer);
//   console.log(targetResultsLoading);
//   console.log(targetResultsQuick);
//   console.log(targetResultsRegion);
//   targetObserver.observe(targetResultsContainer, observerConfigSm);
//   targetObserver.observe(targetResultsLoading, observerConfigSm);
//   targetObserver.observe(targetResultsQuick, observerConfigSm);
//   targetObserver.observe(targetResultsRegion, observerConfigSm);

//   if (regionSearchButton && !(state.resultsContainer)) {
//     console.log('About to click regionSearchButton.');
//     regionSearchButton.click();

//     const regionSelector = <HTMLSelectElement>document.querySelector('select[name="regionValue"]');
//     regionSelector.options[1].selected = true; // Los Angeles

//     const categorySelector = <HTMLSelectElement>document.querySelector('select[name="categoryValue"]');
//     categorySelector.options[1].selected = true; // Episodics

//     const formSearchButton = <HTMLInputElement>document.querySelector('input[name="regionButton"]')
//     formSearchButton.click();

//     // const sortByDropdown = <HTMLSelectElement>document.querySelector('select[name="sort-search_region"]');
//     // console.log(sortByDropdown);
//     // const sortByDropdownObserver = new MutationObserver((mutations) => {
//     //   mutations.forEach((mutation) => {
//     //     console.table(mutation);
//     //     // const el = mutation.target as HTMLElement;
//     //   })
//     // })
//     // sortByDropdownObserver.observe(sortByDropdown, observerConfigLg);
//     // const sortByClickable = <HTMLElement>document.querySelector('#results_region div.div-selector');
//     // console.log(sortByClickable);
//     // sortByClickable.click();
//     const sortByUL = <HTMLElement>document.querySelector('#results_region ul');
//     console.log(sortByUL);
//     sortByUL.style.display = 'block';
//     // sortByUL.click();
//     const newestLI = <HTMLUListElement>document.querySelector('li.option-selector[rel="Newest"]')
//     console.log(newestLI);
//     newestLI.click();
//     // const sortByULObserver = new MutationObserver((mutations) => {
//     //   mutations.forEach((mutation) => {
//     //     console.table(mutation);
//     //     // const el = mutation.target as HTMLElement;
//     //   })
//     // })
//     // sortByULObserver.observe(sortByUL, observerConfigLg);

//     console.table(state);
//   }

//   // sortByDropdown.options[0].selected = true; // Newest

//   console.log('Goodbye from runContentScript');
// }

const run = async () => {
  var el = document.querySelector('input[name="regionButton"]')
  var style = window.getComputedStyle(el)
  var searchVisible = (style.visibility === 'visible')
  if (!searchVisible) {
    var regionSearchButton = <HTMLButtonElement>document.querySelector('button[name="searchMethodButtons_region"]');
    regionSearchButton.click();
  } else {
    const regionSelector = <HTMLSelectElement>document.querySelector('select[name="regionValue"]');
    regionSelector.options[1].selected = true; // Los Angeles

    const categorySelector = <HTMLSelectElement>document.querySelector('select[name="categoryValue"]');
    categorySelector.options[1].selected = true; // Episodics

    const formSearchButton = <HTMLInputElement>document.querySelector('input[name="regionButton"]')
    formSearchButton.click();
  }
}

console.emoji('🦄', 'Showfax Assistant ContentScript/index loaded');
import { onError, sleep } from '../helpers';

const sendToBackgroundScript = (e: Event) => {
  console.log('sendToBackgroundScript in ContentScript/index:');
  console.dir(e);
  browser.runtime.sendMessage({
    "title": "click",
    "message": "happened"
  });
}
window.addEventListener("click", sendToBackgroundScript);

// const onMessageHandler = (message: any): void => {
//   console.log('Showfax Assistant received message in ContentScript/index:', message);
//   if (message.title === 'run') {
//     run();
//   }
// }
// browser.runtime.onMessage.addListener(onMessageHandler);

browser.runtime.onMessage.addListener(request => {
  console.log("Message from the SA background script:");
  console.log(request.greeting);
  return Promise.resolve({ response: "Hi from Showfax Assistant content script" });
});

export {};
