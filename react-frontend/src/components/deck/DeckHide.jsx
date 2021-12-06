import React from 'react';
import { Button } from 'react-bootstrap';
import LightbulbFill from 'assets/images/icons/lightbulb-fill.svg';
import LightbulbOffFill from 'assets/images/icons/lightbulb-off-fill.svg';
import { useApp } from 'context';

function DeckHide(props) {
  const { decks, deckUpdate } = useApp();

  const handleClick = () => {
    deckUpdate(props.deckid, 'hidden', !decks[props.deckid].hidden);
  };

  return (
    <>
      <Button
        title="Toggle Show/Hide deck from Deck Selector"
        variant="primary"
        onClick={handleClick}
      >
        <div className="d-flex justify-content-center align-items-center">
          <div>
            {decks[props.deckid].hidden ? (
              <LightbulbOffFill />
            ) : (
              <LightbulbFill />
            )}
          </div>
        </div>
      </Button>
    </>
  );
}

export default DeckHide;