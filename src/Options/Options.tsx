import React, { useState } from 'react';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { browser } from 'webextension-polyfill-ts';
import Form from 'react-bootstrap/Form';

import '../styles/styles.scss';

const Options: React.FC = () => {
  browser.storage.local.get('change_showfax_titles')
    .then((result) => {
      console.info(`browser.storage.local.get('change_showfax_titles')`, result)
      if (typeof result === 'boolean') {
        setCbTitles(result);
      } else {
        setCbTitles(true)
      }
      return false;
    });
  const [cbTitles, setCbTitles] = useState(true);
  // const handleToggle = (e) => setCbTitles(e);
  return (
    <Container fluid className='my-4'>
      <Row>
        <Col>
          <strong>Showfax Assistant Options</strong>
          <Form>
            <Form.Check custom type="checkbox" id='change_showfax_titles' label="Change Showfax Titles" checked={cbTitles} onChange={(e) => setCbTitles(e.target.checked)} />
            <Form.Check custom type="checkbox" label="Add Showfax Dropdowns" />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Options;
