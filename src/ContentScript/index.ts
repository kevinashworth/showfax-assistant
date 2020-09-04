import { browser } from 'webextension-polyfill-ts';

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

console.log('Showfax Assistant ContentScript/index loaded');
export {};
