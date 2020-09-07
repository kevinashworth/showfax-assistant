import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { browser, Tabs } from 'webextension-polyfill-ts';

import '../styles/styles.scss';

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}

const Popup: React.FC = () => {
  return (
    <Container className='my-4'>
      <Row>
        <Col>
      <h3>This is the Popup Page</h3>
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
        </Col>
      </Row>
    </Container>
  );
};

export default Popup;
