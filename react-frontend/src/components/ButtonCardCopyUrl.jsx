import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Link45Deg from 'assets/images/icons/link-45deg.svg';
import { useApp } from 'context';

function ButtonCardCopyUrl(props) {
  const { isMobile } = useApp();

  const [state, setState] = useState(false);

  const deckUrl = `${process.env.ROOT_URL}cards/${props.id}`;

  const handleButton = () => {
    navigator.clipboard.writeText(deckUrl);
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 1000);
    isMobile && props.setShowButtons(false);
  };

  return (
    <>
      {!state ? (
        <Button
          className="card-buttons"
          variant="primary"
          onClick={handleButton}
          title="Copy URL"
        >
          <Link45Deg />
        </Button>
      ) : (
        <Button variant="success" onClick={handleButton}>
          Copied
        </Button>
      )}
    </>
  );
}

export default ButtonCardCopyUrl;
