import React from 'react';

import DeckCardQuantity from './DeckCardQuantity.jsx';
import ResultCryptCapacity from './ResultCryptCapacity.jsx';
import ResultCryptDisciplines from './ResultCryptDisciplines.jsx';
import ResultCryptName from './ResultCryptName.jsx';
import ResultCryptClan from './ResultCryptClan.jsx';
import ResultCryptGroup from './ResultCryptGroup.jsx';

function DeckCryptSideBody(props) {
  const SortByCapacity = (a, b) => {
    if (a.c['Capacity'] > b.c['Capacity']) {
      return -1;
    } else {
      return 1;
    }
  };

  const sorted_cards = Object.values(props.cards).sort(SortByCapacity);

  let resultTrClass;

  const cards = sorted_cards.map((card, index) => {
    if (resultTrClass == 'crypt-result-odd') {
      resultTrClass = 'crypt-result-even';
    } else {
      resultTrClass = 'crypt-result-odd';
    }

    return (
      <React.Fragment key={index}>
        <tr className={resultTrClass}>
            <td className='quantity'>
              { props.isAuthor
                ? <DeckCardQuantity
                  cardid={card.c['Id']}
                  q={card.q}
                  deckid={props.deckid}
                  deckCardChange={props.deckCardChange}
                />
                : card.q ? card.q : null
              }
            </td>
          <td className='capacity'>
            <ResultCryptCapacity value={card.c['Capacity']} />
          </td>
          <td className='disciplines'>
            <ResultCryptDisciplines
              disciplines_set={props.disciplines_set}
              value={card.c['Disciplines']}
            />
          </td>
          <td className='name'>
            <ResultCryptName
              id={card.c['Id']}
              value={card.c['Name']}
              adv={card.c['Adv']}
              ban={card.c['Banned']}
              card={card.c}
              showImage={props.showImage}
              toggleImage={props.toggleImage}
            />
          </td>
          <td className='clan'>
            <ResultCryptClan value={card.c['Clan']} />
          </td>
          <td className='group'>
            <ResultCryptGroup value={card.c['Group']} />
          </td>
        </tr>
      </React.Fragment>
    );
  });
  return <tbody>{cards}</tbody>;
}

function DeckCryptBody(props) {
  const SortByQuantity = (a, b) => {
    if (a.q > b.q) {
      return -1;
    } else {
      return 1;
    }
  };

  const sorted_cards = Object.values(props.cards).sort(SortByQuantity);
  let resultTrClass;

  const cards = sorted_cards.map((card, index) => {
    if (resultTrClass == 'crypt-result-odd') {
      resultTrClass = 'crypt-result-even';
    } else {
      resultTrClass = 'crypt-result-odd';
    }

    return (
      <React.Fragment key={index}>
        <tr className={resultTrClass}>
            <td className='quantity'>
              { props.isAuthor
                ? <DeckCardQuantity
                    cardid={card.c['Id']}
                    q={card.q}
                    deckid={props.deckid}
                    deckCardChange={props.deckCardChange}
                  />
                : card.q ? card.q : null
              }
            </td>
          <td className='capacity'>
            <ResultCryptCapacity value={card.c['Capacity']} />
          </td>
          <td className='disciplines'>
            <ResultCryptDisciplines
              disciplines_set={props.disciplines_set}
              value={card.c['Disciplines']}
            />
          </td>
          <td className='name'>
            <ResultCryptName
              id={card.c['Id']}
              value={card.c['Name']}
              adv={card.c['Adv']}
              ban={card.c['Banned']}
              card={card.c}
              showImage={props.showImage}
              toggleImage={props.toggleImage}
            />
          </td>
          <td className='clan'>
            <ResultCryptClan value={card.c['Clan']} />
          </td>
          <td className='group'>
            <ResultCryptGroup value={card.c['Group']} />
          </td>
        </tr>
      </React.Fragment>
    );
  });
  return <tbody>{cards}</tbody>;
}

function DeckCrypt(props) {
  let d_set = new Set();
  for (const card of Object.keys(props.cards)) {
    for (const d of Object.keys(props.cards[card].c['Disciplines'])) {
      d_set.add(d);
    };
  };
  const disciplines_set = [...d_set].sort();

  const crypt = {};
  const crypt_side = {};

  let crypt_group_min;
  let crypt_group_max;

  Object.keys(props.cards).map((card, index) => {
    if (props.cards[card].q > 0) {
      crypt[card] = props.cards[card];
    } else {
      crypt_side[card] = props.cards[card];
    }

    if (props.cards[card].c['Group'] < crypt_group_min || crypt_group_min == undefined) {
      crypt_group_min = props.cards[card].c['Group'];
    }
    if (props.cards[card].c['Group'] > crypt_group_max || crypt_group_max == undefined) {
      crypt_group_max = props.cards[card].c['Group'];
    }
  });

  let crypt_total = 0;
  for (const card in crypt) {
    crypt_total += crypt[card].q;
  }

  let crypt_groups;
  if (crypt_group_max - crypt_group_min == 1) {
    crypt_groups = 'G' + crypt_group_min + '-' + crypt_group_max;
  } else if (crypt_group_max - crypt_group_min == 0) {
    crypt_groups = 'G' + crypt_group_max;
  } else {
    crypt_groups = 'ERROR IN GROUPS';
  }

  return (
    <>
      <div className='deck-crypt'>
        <b>Crypt [{crypt_total}] - {crypt_groups}</b>
        <table className='deck-crypt-table'>
          <DeckCryptBody
            deckid={props.deckid}
            deckCardChange={props.deckCardChange}
            cards={crypt}
            disciplines_set={disciplines_set}
            showImage={props.showImage}
            toggleImage={props.toggleImage}
            isAuthor={props.isAuthor}
          />
        </table>
      </div>
      { Object.keys(crypt_side).length > 0 &&
        <div className='deck-sidecrypt'>
          <b>Side Crypt</b>
          <table className='deck-crypt-table'>
            <DeckCryptSideBody
              deckid={props.deckid}
              deckCardChange={props.deckCardChange}
              cards={crypt_side}
              disciplines_set={disciplines_set}
              showImage={props.showImage}
              toggleImage={props.toggleImage}
              isAuthor={props.isAuthor}
            />
          </table>
        </div>
      }
    </>
  );
}

export default DeckCrypt;
