import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import reactStringReplace from 'react-string-replace';
import icons from 'components/forms_data/disciplineIcons.json';
import { useApp } from 'context';
import { CardPopover, ResultCryptName, ResultLibraryName } from 'components';

const ResultLayoutTextText = (props) => {
  const { cryptCardBase, libraryCardBase, isMobile } = useApp();

  const text = props.text.replace(/\(D\)/g, '\u24B9').split('\n');

  const CardText = text.map((i, index) => {
    let replacedText;

    replacedText = reactStringReplace(i, /\[(\w+?)\]/g, (match, idx) => (
      <img
        key={`${match}-${idx}`}
        className={
          match.toLowerCase() === match
            ? 'discipline-base-image-results'
            : 'discipline-superior-image-results'
        }
        src={`${process.env.ROOT_URL}images/disciplines/${icons[match]}.svg`}
        title={match}
      />
    ));

    replacedText = reactStringReplace(
      replacedText,
      /\/(.*?)\//g,
      (match, idx) => {
        const cardBase = { ...cryptCardBase, ...libraryCardBase };
        const cardid = Object.keys(cardBase).find(
          (j) => cardBase[j]['Name'] == match
        );

        if (cardid) {
          return (
            <span key={`${cardid}-${idx}`}>
              {isMobile ? (
                <div className="d-inline">
                  {cardid > 200000 ? (
                    <ResultCryptName card={cryptCardBase[cardid]} />
                  ) : (
                    <ResultLibraryName card={libraryCardBase[cardid]} />
                  )}
                </div>
              ) : (
                <OverlayTrigger
                  placement={props.placement ? props.placement : 'right'}
                  overlay={
                    <CardPopover
                      card={
                        cardid > 200000
                          ? cryptCardBase[cardid]
                          : libraryCardBase[cardid]
                      }
                    />
                  }
                >
                  <div className="d-inline">
                    {cardid > 200000 ? (
                      <ResultCryptName card={cryptCardBase[cardid]} />
                    ) : (
                      <ResultLibraryName card={libraryCardBase[cardid]} />
                    )}
                  </div>
                </OverlayTrigger>
              )}
            </span>
          );
        } else {
          return <React.Fragment key={idx}>/{match}/</React.Fragment>;
        }
      }
    );

    return (
      <React.Fragment key={index}>
        {replacedText}
        <br />
      </React.Fragment>
    );
  });

  return <>{CardText}</>;
};

export default ResultLayoutTextText;