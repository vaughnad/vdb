import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function DeckNameDeck(props) {
  const [state, setState] = useState(props.name);

  const handleChange = event => {
    setState(event.target.value);
  };

  const clearFormButton = () => {
    setState('');
  };

  const deckNameButton = () => {
    if (state) {
      props.deckUpdate(props.deckid, 'name', state);
    } else {
      console.log('Error: submit with empty form');
    };
  };

  useEffect(() => {
    setState(props.name);
  }, [props.name]);

  return (
    <>
      <textarea value={state} onChange={handleChange} />
      <Button variant='outline-primary' onClick={deckNameButton}>
        Update
      </Button>
      <Button variant='outline-primary' onClick={clearFormButton}>
        Clear
      </Button>
    </>
  );
}

export default DeckNameDeck;