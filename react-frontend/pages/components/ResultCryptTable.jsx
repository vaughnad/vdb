import React, { useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import Shuffle from '../../assets/images/icons/shuffle.svg';
import PinAngleFill from '../../assets/images/icons/pin-angle-fill.svg';
import CardPopover from './CardPopover.jsx';
import UsedPopover from './UsedPopover.jsx';
import UsedDescription from './UsedDescription.jsx';
import DeckCardQuantity from './DeckCardQuantity.jsx';
import ResultCryptCapacity from './ResultCryptCapacity.jsx';
import ResultCryptDisciplines from './ResultCryptDisciplines.jsx';
import ResultCryptName from './ResultCryptName.jsx';
import ResultCryptClan from './ResultCryptClan.jsx';
import ResultCryptGroup from './ResultCryptGroup.jsx';
import ResultAddCard from './ResultAddCard.jsx';
import ResultCryptModal from './ResultCryptModal.jsx';

function ResultCryptTable(props) {
  let resultTrClass;
  let deckInvType;

  const [modalCard, setModalCard] = useState(undefined);
  const [modalInventory, setModalInventory] = useState(undefined);

  const cardRows = props.resultCards.map((card, index) => {
    const handleClick = () => {
      setModalCard(card);
      props.isMobile && props.setShowFloatingButtons(false);
      setModalInventory({
        inInventory: inInventory,
        softUsedMax: softUsedMax,
        hardUsedTotal: hardUsedTotal,
        usedDescription: {
          soft: SoftUsedDescription,
          hard: HardUsedDescription,
        },
      });
    };

    let q;
    let cardInvType;
    if (props.className == 'deck-crypt-table') {
      q = card.q;
      if (props.inventoryMode && props.decks[props.deckid]) {
        cardInvType = card.i;
        deckInvType = props.decks[props.deckid].inventory_type;
      }
      card = card.c;
    }

    if (resultTrClass == 'result-odd') {
      resultTrClass = 'result-even';
    } else {
      resultTrClass = 'result-odd';
    }

    let inDeck;
    if (props.crypt) {
      Object.keys(props.crypt).map((i, index) => {
        if (i == card['Id']) {
          inDeck = props.crypt[i].q;
        }
      });
    }

    let inInventory = null;
    let softUsedMax = 0;
    let hardUsedTotal = 0;
    let SoftUsedDescription;
    let HardUsedDescription;

    if (
      props.inventoryMode &&
      (props.deckid || props.className != 'deck-crypt-table')
    ) {
      if (Object.keys(props.inventoryCrypt).includes(card['Id'].toString())) {
        inInventory = props.inventoryCrypt[card['Id']].q;
      } else {
        inInventory = 0;
      }

      if (props.usedCards && props.usedCards.soft[card['Id']]) {
        SoftUsedDescription = Object.keys(props.usedCards.soft[card['Id']]).map(
          (id, index) => {
            if (softUsedMax < props.usedCards.soft[card['Id']][id]) {
              softUsedMax = props.usedCards.soft[card['Id']][id];
            }
            return (
              <UsedDescription
                key={index}
                q={props.usedCards.soft[card['Id']][id]}
                deckName={props.decks[id]['name']}
              />
            );
          }
        );
      }

      if (props.usedCards && props.usedCards.hard[card['Id']]) {
        HardUsedDescription = Object.keys(props.usedCards.hard[card['Id']]).map(
          (id, index) => {
            hardUsedTotal += props.usedCards.hard[card['Id']][id];
            return (
              <UsedDescription
                key={index}
                q={props.usedCards.hard[card['Id']][id]}
                deckName={props.decks[id]['name']}
              />
            );
          }
        );
      }
    }

    return (
      <React.Fragment key={index}>
        <tr className={resultTrClass}>
          {props.proxySelected && (
            <td className="proxy-selector">
              <div className="custom-control custom-checkbox">
                <input
                  id={card['Id']}
                  name="print"
                  className="custom-control-input"
                  type="checkbox"
                  checked={
                    props.proxySelected[card['Id']]
                      ? props.proxySelected[card['Id']].print
                      : false
                  }
                  onChange={(e) => props.proxySelector(e)}
                />
                <label htmlFor={card['Id']} className="custom-control-label" />
              </div>
            </td>
          )}
          {props.className == 'deck-crypt-table' ? (
            <>
              {props.isAuthor ? (
                <>
                  {props.inventoryMode ? (
                    <>
                      {deckInvType && !props.inSearch && !props.isMobile ? (
                        <td className="pt-2 left-offset-8 opacity-075">
                          <div
                            className={cardInvType ? '' : 'opacity-025'}
                            onClick={() =>
                              props.deckUpdate(
                                props.deckid,
                                cardInvType
                                  ? 'makeClear'
                                  : deckInvType == 's'
                                  ? 'makeFixed'
                                  : 'makeFlexible',
                                card['Id']
                              )
                            }
                          >
                            {deckInvType == 's' ? (
                              <PinAngleFill />
                            ) : (
                              <Shuffle />
                            )}
                          </div>
                        </td>
                      ) : null}
                      {!props.isMobile ? (
                        <OverlayTrigger
                          placement="right"
                          overlay={
                            <UsedPopover
                              softUsedMax={softUsedMax}
                              hardUsedTotal={hardUsedTotal}
                              inInventory={inInventory}
                              SoftUsedDescription={SoftUsedDescription}
                              HardUsedDescription={HardUsedDescription}
                            />
                          }
                        >
                          <td className="quantity">
                            <DeckCardQuantity
                              cardid={card['Id']}
                              q={q}
                              deckid={props.deckid}
                              cardChange={props.cardChange}
                              isMobile={props.isMobile}
                              inInventory={inInventory}
                              softUsedMax={softUsedMax}
                              hardUsedTotal={hardUsedTotal}
                              inventoryType={
                                props.decks[props.deckid].inventory_type
                              }
                            />
                          </td>
                        </OverlayTrigger>
                      ) : (
                        <td className="quantity">
                          <DeckCardQuantity
                            cardid={card['Id']}
                            q={q}
                            deckid={props.deckid}
                            cardChange={props.cardChange}
                            isMobile={props.isMobile}
                            inInventory={inInventory}
                            softUsedMax={softUsedMax}
                            hardUsedTotal={hardUsedTotal}
                            inventoryType={
                              props.decks[props.deckid].inventory_type
                            }
                          />
                        </td>
                      )}
                    </>
                  ) : (
                    <td className="quantity">
                      <DeckCardQuantity
                        cardid={card['Id']}
                        q={q}
                        deckid={props.deckid}
                        cardChange={props.cardChange}
                        isMobile={props.isMobile}
                      />
                    </td>
                  )}
                </>
              ) : props.proxySelected ? (
                <td className="quantity">
                  <DeckCardQuantity
                    cardid={card['Id']}
                    deckid={null}
                    q={
                      props.proxySelected[card['Id']]
                        ? props.proxySelected[card['Id']].q
                        : 0
                    }
                    cardChange={props.proxyCounter}
                    isMobile={props.isMobile}
                  />
                </td>
              ) : (
                <>
                  {props.inventoryMode ? (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <UsedPopover
                          softUsedMax={softUsedMax}
                          hardUsedTotal={hardUsedTotal}
                          inInventory={inInventory}
                          SoftUsedDescription={SoftUsedDescription}
                          HardUsedDescription={HardUsedDescription}
                        />
                      }
                    >
                      <td className="quantity-no-buttons px-2">
                        <div
                          className={
                            inInventory < q
                              ? 'quantity px-1 mx-1 bg-red'
                              : inInventory - hardUsedTotal < q
                              ? 'quantity px-1 mx-1 bg-yellow'
                              : 'quantity px-1'
                          }
                        >
                          {q}
                        </div>
                      </td>
                    </OverlayTrigger>
                  ) : (
                    <td className="quantity-no-buttons px-2">
                      {q ? q : <div className="transparent">0</div>}
                    </td>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {props.addMode && (
                <td className="quantity-add">
                  <ResultAddCard
                    cardAdd={props.cardAdd}
                    cardChange={props.cardChange}
                    cardid={card['Id']}
                    deckid={props.activeDeck.deckid}
                    card={card}
                    inDeck={inDeck}
                  />
                </td>
              )}
              {props.inventoryMode && (
                <>
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <UsedPopover
                        softUsedMax={softUsedMax}
                        hardUsedTotal={hardUsedTotal}
                        inInventory={inInventory}
                        SoftUsedDescription={SoftUsedDescription}
                        HardUsedDescription={HardUsedDescription}
                      />
                    }
                  >
                    <td className="quantity px-1">
                      <div
                        className={
                          inInventory < softUsedMax + hardUsedTotal
                            ? 'quantity px-1 mx-1 bg-red'
                            : 'quantity px-1'
                        }
                      >
                        {inInventory > 0 && inInventory}
                      </div>
                    </td>
                  </OverlayTrigger>
                  <td className="used">
                    {softUsedMax > 0 && (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="d-inline opacity-035 pr-1">
                          <Shuffle />
                        </div>
                        {softUsedMax}
                      </div>
                    )}
                    {hardUsedTotal > 0 && (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="d-inline opacity-035 pr-1">
                          <PinAngleFill />
                        </div>
                        {hardUsedTotal}
                      </div>
                    )}
                  </td>
                </>
              )}
            </>
          )}
          <td
            className={
              props.isMobile && props.className == 'deck-crypt-table'
                ? 'capacity'
                : 'capacity px-1'
            }
            onClick={() => handleClick()}
          >
            <ResultCryptCapacity value={card['Capacity']} />
          </td>
          <td
            className={
              props.keyDisciplines + props.nonKeyDisciplines < 8
                ? `disciplines cols-${
                    props.keyDisciplines + props.nonKeyDisciplines
                  }`
                : 'disciplines'
            }
            onClick={() => handleClick()}
          >
            <ResultCryptDisciplines
              value={card['Disciplines']}
              disciplinesSet={props.disciplinesSet}
              keyDisciplines={props.keyDisciplines}
              nonKeyDisciplines={props.nonKeyDisciplines}
              isMobile={props.isMobile}
            />
          </td>
          {!props.isMobile ? (
            <OverlayTrigger
              placement={props.placement ? props.placement : 'right'}
              overlay={<CardPopover card={card} showImage={props.showImage} />}
            >
              <td
                className="name px-1"
                onClick={() => {
                  handleClick();
                  setModalInventory({
                    inInventory: inInventory,
                    usedDescription: {
                      soft: SoftUsedDescription,
                      hard: HardUsedDescription,
                    },
                    softUsedMax: softUsedMax,
                    hardUsedTotal: hardUsedTotal,
                  });
                }}
              >
                <ResultCryptName card={card} />
              </td>
            </OverlayTrigger>
          ) : (
            <td
              className="name px-1"
              onClick={() => {
                handleClick();
                setModalInventory({
                  inInventory: inInventory,
                  usedDescription: {
                    soft: SoftUsedDescription,
                    hard: HardUsedDescription,
                  },
                  softUsedMax: softUsedMax,
                  hardUsedTotal: hardUsedTotal,
                });
              }}
            >
              <ResultCryptName card={card} />
            </td>
          )}
          {props.isMobile || !props.isWide ? (
            <td className="clan-group" onClick={() => handleClick()}>
              <div>
                <ResultCryptClan value={card['Clan']} />
              </div>
              <div className="d-flex small justify-content-end">
                <ResultCryptGroup value={card['Group']} />
              </div>
            </td>
          ) : (
            <>
              <td className="clan" onClick={() => handleClick()}>
                <ResultCryptClan value={card['Clan']} />
              </td>
              <td className="group" onClick={() => handleClick()}>
                <ResultCryptGroup value={card['Group']} />
              </td>
            </>
          )}
        </tr>
      </React.Fragment>
    );
  });

  return (
    <>
      <table className={props.className}>
        <tbody>{cardRows}</tbody>
      </table>
      {modalCard && (
        <ResultCryptModal
          show={modalCard ? true : false}
          card={modalCard}
          showImage={props.showImage}
          setShowImage={props.setShowImage}
          handleClose={() => {
            setModalCard(false);
            props.isMobile && props.setShowFloatingButtons(true);
          }}
          isMobile={props.isMobile}
          inventoryState={modalInventory}
          inventoryMode={props.inventoryMode}
        />
      )}
    </>
  );
}

export default ResultCryptTable;
