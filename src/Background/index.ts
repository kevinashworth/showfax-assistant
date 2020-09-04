import 'emoji-log';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { onError } from '../helpers';

let saTabId = null;

const onInstalledHandler = (details): void => {
  console.emoji('🦄', 'Showfax Assistant installed');
  if (details.reason === "install") {
    browser.storage.local.set({ change_showfax_titles: true });
    browser.storage.local.set({ add_showfax_dropdowns: true });
    console.log("Thank you for installing" + browser.runtime.getManifest().name + "!");
  } else if (details.reason === "update") {
    const thisVersion = browser.runtime.getManifest().version;
    console.log("Updating " + browser.runtime.getManifest().name + " from " + details.previousVersion + " to " + thisVersion + "!");
  }
}
browser.runtime.onInstalled.addListener(onInstalledHandler);

const onMessageHandler = (message: any): void => {
  console.log('Showfax Assistant message in Background/index:', message);
}
browser.runtime.onMessage.addListener(onMessageHandler);

function sendMessageToTabs(tabs) {
  for (let tab of tabs) {
    browser.tabs.sendMessage(
      tab.id,
      { greeting: "Hi from Showfax Assistant background script" }
    ).then(response => {
      console.log("Message from the SA content script:");
      console.log(response.response);
    }).catch(onError);
  }
}

browser.tabs.query({
  currentWindow: true,
  active: true
}).then(sendMessageToTabs).catch(onError);
