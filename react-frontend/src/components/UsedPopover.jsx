import React from 'react';
import { Popover } from 'react-bootstrap';
import ArchiveFill from 'assets/images/icons/archive-fill.svg';
import CalculatorFill from 'assets/images/icons/calculator-fill.svg';
import { UsedDescription } from 'components';
import { useApp } from 'context';

const UsedPopover = React.forwardRef((props, ref) => {
  const {
    decks,
    usedCryptCards,
    usedLibraryCards,
    inventoryCrypt,
    inventoryLibrary,
  } = useApp();

  const { cardid, ...rest } = props;

  let softUsedMax = 0;
  let hardUsedTotal = 0;
  let SoftUsedDescription;
  let HardUsedDescription;
  let usedCards = null;

  let inInventory = 0;
  if (cardid > 200000) {
    if (inventoryCrypt[cardid]) {
      inInventory = inventoryCrypt[cardid].q;
    }
    usedCards = usedCryptCards;
  } else {
    if (inventoryLibrary[cardid]) {
      inInventory = inventoryLibrary[cardid].q;
    }
    usedCards = usedLibraryCards;
  }

  if (usedCards && usedCards.soft[cardid]) {
    SoftUsedDescription = Object.keys(usedCards.soft[cardid]).map((id) => {
      if (softUsedMax < usedCards.soft[cardid][id]) {
        softUsedMax = usedCards.soft[cardid][id];
      }
      return (
        <UsedDescription
          key={id}
          q={usedCards.soft[cardid][id]}
          deckName={decks[id]['name']}
          t="s"
        />
      );
    });
  }

  if (usedCards && usedCards.hard[cardid]) {
    HardUsedDescription = Object.keys(usedCards.hard[cardid]).map((id) => {
      hardUsedTotal += usedCards.hard[cardid][id];
      return (
        <UsedDescription
          key={id}
          q={usedCards.hard[cardid][id]}
          deckName={decks[id]['name']}
          t="h"
        />
      );
    });
  }

  return (
    <Popover ref={ref} {...rest}>
      <Popover.Body>
        <>
          {softUsedMax == 0 && hardUsedTotal == 0 ? (
            <div className="py-1">Not used in inventory decks</div>
          ) : (
            <>
              {softUsedMax > 0 && <>{SoftUsedDescription}</>}
              {hardUsedTotal > 0 && <>{HardUsedDescription}</>}
            </>
          )}
          <hr />
          <div className="d-flex align-items-center">
            <div className="opacity-035">
              <CalculatorFill width="14" height="14" viewBox="0 0 16 16" />
            </div>
            <div className="px-1">
              <b>{softUsedMax + hardUsedTotal}</b>
            </div>
            - Total Used
          </div>
          <div className="d-flex align-items-center">
            <div className="opacity-035">
              <ArchiveFill width="14" height="14" viewBox="0 0 16 16" />
            </div>
            <div className="px-1">
              <b>{inInventory}</b>
            </div>
            - In Inventory
          </div>
        </>
      </Popover.Body>
    </Popover>
  );
});
UsedPopover.displayName = 'UsedPopover';

export default UsedPopover;