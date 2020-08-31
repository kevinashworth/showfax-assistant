import React from 'react';
import Form from 'react-bootstrap/Form';

import '../styles/styles.scss';

const Options: React.FC = () => {
  return (
    <div className='container-fluid'>
      <p><strong>This is the Options Page</strong></p>
      <Form>
        <p>
          <Form.Label htmlFor='name'>Lorem</Form.Label>
          <br />
          <Form.Control
            type='text'
            id='name'
            name='name'
            spellCheck='false'
            autoComplete='off'
            required
          />
        </p>
        <p>
          <Form.Label className='red' htmlFor='logging'>Ipsum</Form.Label>
          <Form.Check type='checkbox' name='logging' />
        </p>
      </Form>
    </div>
  );
};

export default Options;
