import React from 'react';
import Button from 'react-bootstrap/Button';
import { browser, Tabs } from 'webextension-polyfill-ts';

import '../styles/styles.scss';

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}

const Popup: React.FC = () => {
  return (
    <div className='container'>
      <h1>This is the Popup Page</h1>
      <Button
        onClick={(): Promise<Tabs.Tab> => {
          return openWebPage('options.html');
        }}
      >
        Open Options Page
      </Button>
      <Button
        variant='link'
        onClick={(): Promise<Tabs.Tab> => {
          return openWebPage(
            'https://github.com/abhijithvijayan/web-extension-starter'
          );
        }}
      >
        GitHub
      </Button>
      <Button
        variant='link'
        onClick={(): Promise<Tabs.Tab> => {
          return openWebPage(
            'https://www.buymeacoffee.com/abhijithvijayan'
          );
        }}
      >
        Buy Me A Coffee
      </Button>
    </div>
  );
};

export default Popup;
