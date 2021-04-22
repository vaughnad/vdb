import React, { useContext } from 'react';
import reactStringReplace from 'react-string-replace';
import Hammer from '../../assets/images/icons/hammer.svg';
import icons from './forms_data/disciplineIcons.json';
import ResultLibraryType from './ResultLibraryType.jsx';
import ResultLibraryCost from './ResultLibraryCost.jsx';
import ResultLibraryBurn from './ResultLibraryBurn.jsx';
import ResultLibraryClan from './ResultLibraryClan.jsx';
import ResultLibraryTrifle from './ResultLibraryTrifle.jsx';
import ResultLibraryDisciplines from './ResultLibraryDisciplines.jsx';
import ResultLayoutTextSets from './ResultLayoutTextSets.jsx';
import ResultLayoutTextRulings from './ResultLayoutTextRulings.jsx';
import AppContext from '../../context/AppContext.js';

function ResultLibraryPopover(props) {
  const { nativeLibrary, localizedLibrary, lang } = useContext(AppContext);

  const imgSrc = `${process.env.ROOT_URL}images/cards/${
    localizedLibrary &&
    localizedLibrary[lang] &&
    localizedLibrary[lang][props.card['Id']]
      ? lang
      : 'en-EN'
  }/${props.card['ASCII Name']
    .toLowerCase()
    .replace(/[\s,:!?'".\-\(\)\/]/g, '')}.jpg`;

  const cardImage = (
    <img
      className={props.fullWidth ? 'card-popover full-width' : 'card-popover'}
      src={imgSrc}
      alt={props.card['Name']}
      onClick={props.handleClose}
    />
  );

  const text = props.card['Card Text'].replace(/\(D\)/g, '\u24B9').split('\n');
  const newText = [];
  text.map((i, index) => {
    newText.push(
      reactStringReplace(i, /\[(\w+)\]/g, (match, x) => (
        <img
          className="discipline-base-image-results"
          src={`${process.env.ROOT_URL}images/disciplines/${icons[match]}.svg`}
          title={match}
        />
      ))
    );
  });

  return (
    <>
      {!props.showImage ? (
        <div className="py-1">
          <div className="d-flex flex-nowrap justify-content-between align-items-center">
            <div className="d-flex flex-nowrap align-items-center">
              <div>
                <ResultLibraryType cardtype={props.card['Type']} />
              </div>
              <div className="name pl-2">
                <b>{props.card['Name']}</b>
                {props.card['Banned'] && (
                  <span className="pl-1">
                    <Hammer />
                  </span>
                )}
              </div>
            </div>
            <div className="pl-1">
              <ResultLibraryDisciplines value={props.card['Discipline']} />
              <ResultLibraryClan value={props.card['Clan']} />
            </div>
            {props.card['Burn Option'] && (
              <div className="pl-1">
                <ResultLibraryBurn value={props.card['Burn Option']} />
              </div>
            )}
            {nativeLibrary[props.card.Id]['Card Text'].includes('Trifle.') && (
              <div className="pl-1">
                <ResultLibraryTrifle
                  value={nativeLibrary[props.card.Id]['Card Text']}
                />
              </div>
            )}
          </div>
          <hr />
          {newText.map((i, index) => {
            return (
              <React.Fragment key={index}>
                {i.map((y, index) => {
                  return <React.Fragment key={index}>{y}</React.Fragment>;
                })}
                <br />
              </React.Fragment>
            );
          })}
          <hr />
          <div className="d-flex align-items-center justify-content-between">
            <ResultLibraryCost
              valuePool={props.card['Pool Cost']}
              valueBlood={props.card['Blood Cost']}
            />
            <div className="popover-sets px-1">
              <ResultLayoutTextSets
                setImageSet={props.setImageSet}
                sets={props.card['Set']}
              />
            </div>
          </div>
          {Object.keys(props.card['Rulings']).length > 0 && (
            <>
              <div className="py-1">
                <b>Rulings: </b>
              </div>
              <div className="small pb-1">
                <ResultLayoutTextRulings rulings={props.card['Rulings']} />
              </div>
            </>
          )}
        </div>
      ) : (
        cardImage
      )}
    </>
  );
}

export default ResultLibraryPopover;
