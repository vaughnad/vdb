import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import Check2 from 'assets/images/icons/check2.svg';
import X from 'assets/images/icons/x.svg';
import {
  ErrorOverlay,
  TwdSearchFormButtons,
  TwdSearchFormPlayer,
  TwdSearchFormPlayers,
  TwdSearchFormLocation,
  TwdSearchFormEvent,
  TwdSearchFormDate,
  TwdSearchFormClan,
  TwdSearchFormCardtypes,
  TwdSearchFormCapacity,
  TwdSearchFormDisciplines,
  TwdSearchFormCrypt,
  TwdSearchFormLibrary,
  TwdSearchFormLibraryTotal,
  TwdSearchFormMatchInventory,
  TwdSearchFormMatchInventoryScaling,
} from 'components';
import defaults from 'components/forms_data/defaultsTwdForm.json';
import sanitizeFormState from 'components/sanitizeFormState.js';
import { useApp } from 'context';

function TwdSearchForm(props) {
  const {
    cryptCardBase,
    libraryCardBase,
    twdFormState,
    setTwdFormState,
    setTwdResults,
    setShowTwdSearch,
    inventoryMode,
    isMobile,
  } = useApp();

  const [spinnerState, setSpinnerState] = useState(false);
  const showLimit = 25;
  const navigate = useNavigate();
  const query = JSON.parse(new URLSearchParams(useLocation().search).get('q'));

  useEffect(() => {
    if (cryptCardBase && libraryCardBase && query) {
      setTwdFormState((prevState) => {
        const state = { ...prevState };
        Object.keys(query).map((i) => {
          if (typeof query[i] === 'object') {
            Object.keys(query[i]).map((j) => {
              state[i][j] = query[i][j];
            });
          } else {
            state[i] = query[i];
          }
        });
        return state;
      });
    }
  }, [cryptCardBase, libraryCardBase]);

  useEffect(() => {
    if (isMobile && query && twdFormState) {
      launchRequest();
    }
  }, [twdFormState]);

  const [showError, setShowError] = useState(false);
  const refError = useRef(null);

  const handleEventChange = (event) => {
    const value = event.target.value;
    setTwdFormState((prevState) => ({
      ...prevState,
      event: value,
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event;
    setTwdFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCardtypeChange = (event) => {
    const { name, value } = event;
    const newState = twdFormState.cardtypes;
    newState[name] = value;
    setTwdFormState((prevState) => ({
      ...prevState,
      cardtypes: newState,
    }));
  };

  const handleDateChange = (event) => {
    const { name, value } = event;
    const newState = twdFormState.date;
    newState[name] = value;
    setTwdFormState((prevState) => ({
      ...prevState,
      date: newState,
    }));
  };

  const handlePlayersChange = (event) => {
    const { name, value } = event;
    const newState = twdFormState.players;
    newState[name] = value;
    setTwdFormState((prevState) => ({
      ...prevState,
      players: newState,
    }));
  };

  const handleMatchInventoryChange = (event) => {
    const { name, value } = event;
    const newState = twdFormState.matchInventory;
    newState[name] = value;
    setTwdFormState((prevState) => ({
      ...prevState,
      matchInventory: newState,
    }));
  };

  const handleMatchInventoryScalingChange = (e) => {
    const newState = twdFormState.matchInventory;
    if (e.target.checked) {
      newState.scaling = e.target.name;
    } else {
      newState.scaling = false;
    }
    setTwdFormState((prevState) => ({
      ...prevState,
      matchInventory: newState,
    }));
  };

  const handleMultiChange = (event) => {
    const { name, id, value } = event.target;
    const newState = twdFormState[name];
    const i = value ? value : id;
    newState[i] = !newState[i];
    setTwdFormState((prevState) => ({
      ...prevState,
      [name]: newState,
    }));
  };

  const handleClearButton = () => {
    setTwdFormState(JSON.parse(JSON.stringify(defaults)));
    setTwdResults(undefined);
    setShowError(false);
    navigate('/twd');
  };

  const handleSubmitButton = (event) => {
    event.preventDefault();
    launchRequest();
  };

  const launchRequest = () => {
    const url = `${process.env.API_URL}search/twd`;
    const input = sanitizeFormState('twd', twdFormState);

    if (Object.keys(input).length !== 0) {
      navigate(`/twd?q=${encodeURIComponent(JSON.stringify(input))}`);

      const options = {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      };

      setShowError(false);
      setSpinnerState(true);

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          setSpinnerState(false);
          setShowTwdSearch(false);
          setTwdResults(data);
        })
        .catch((error) => {
          setSpinnerState(false);
          setTwdResults([]);
          setShowError(true);
        });
    }
  };

  const getNewTwd = (q) => {
    setSpinnerState(true);
    setShowError(false);
    setTwdFormState(JSON.parse(JSON.stringify(defaults)));
    navigate('/twd');

    const url = `${process.env.API_URL}twd/new/${q}`;
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setSpinnerState(false);
        setShowTwdSearch(false);
        setTwdResults(data);
      })
      .catch((error) => {
        setSpinnerState(false);
        setTwdResults([]);
        setShowError(true);
      });
  };

  const getRandomTwd = (q) => {
    setSpinnerState(true);
    setShowError(false);
    setTwdFormState(JSON.parse(JSON.stringify(defaults)));
    navigate('/twd');

    const url = `${process.env.API_URL}twd/random/${q}`;
    const options = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        setSpinnerState(false);
        setShowTwdSearch(false);
        setTwdResults(data);
      })
      .catch((error) => {
        setSpinnerState(false);
        setTwdResults([]);
      });
  };

  useEffect(() => {
    if (!isMobile && (!twdFormState.event || twdFormState.event.length > 2)) {
      launchRequest();
    }
  }, [twdFormState]);

  return (
    <Form onSubmit={handleSubmitButton}>
      <TwdSearchFormButtons
        handleClearButton={handleClearButton}
        showLimit={showLimit}
        getNewTwd={getNewTwd}
        getRandomTwd={getRandomTwd}
      />
      {inventoryMode && (
        <>
          <Row className="py-1 ps-1 mx-0 align-items-center">
            <Col xs={6} className="d-flex px-0">
              <label className="h6 mb-0">In Inventory by Crypt:</label>
            </Col>
            <Col xs={6} className="d-inline px-0">
              <TwdSearchFormMatchInventory
                value={twdFormState.matchInventory.crypt}
                name={'crypt'}
                onChange={handleMatchInventoryChange}
              />
            </Col>
          </Row>
          <Row className="py-1 ps-1 mx-0 align-items-center">
            <Col xs={6} className="d-flex px-0">
              <label className="h6 mb-0">In Inventory by Library:</label>
            </Col>
            <Col xs={6} className="d-inline px-0">
              <TwdSearchFormMatchInventory
                value={twdFormState.matchInventory.library}
                name={'library'}
                onChange={handleMatchInventoryChange}
              />
            </Col>
          </Row>
          <Row className="py-1 ps-1 mx-0 align-items-center">
            <Col xs={{ span: 6, offset: 6 }} className="d-inline px-0">
              <TwdSearchFormMatchInventoryScaling
                target="60"
                value={twdFormState.matchInventory.scaling}
                onChange={handleMatchInventoryScalingChange}
              />
              <TwdSearchFormMatchInventoryScaling
                target="75"
                value={twdFormState.matchInventory.scaling}
                onChange={handleMatchInventoryScalingChange}
              />
            </Col>
          </Row>
        </>
      )}
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={2} className="d-flex px-0">
          <div className="bold blue px-0">Year:</div>
        </Col>
        <Col xs={10} className="d-inline px-0">
          <TwdSearchFormDate
            date={twdFormState.date}
            onChange={handleDateChange}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={2} className="d-flex px-0">
          <div className="bold blue px-0">Players:</div>
        </Col>
        <Col xs={10} className="d-inline px-0">
          <TwdSearchFormPlayers
            players={twdFormState.players}
            onChange={handlePlayersChange}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <div className="bold blue px-0">Crypt Cards:</div>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={12} className="d-inline px-0">
          <TwdSearchFormCrypt
            state={twdFormState.crypt}
            setState={setTwdFormState}
            spinner={spinnerState}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={{ span: 9, offset: 3 }} className="d-inline px-0">
          <Form.Check
            name="traits"
            value="star"
            type="checkbox"
            id="traits-star"
            label="With Star Vampire"
            checked={twdFormState.traits.star}
            onChange={(e) => handleMultiChange(e)}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <div className="bold blue px-0">Library Cards:</div>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={12} className="d-inline px-0">
          <TwdSearchFormLibrary
            state={twdFormState.library}
            setState={setTwdFormState}
            spinner={spinnerState}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={3} className="d-flex px-0">
          <div className="bold blue px-0">Library Size:</div>
        </Col>
        <Col xs={9} className="d-flex justify-content-end px-0">
          <TwdSearchFormLibraryTotal
            value={twdFormState.libraryTotal}
            onChange={handleMultiChange}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={3} className="d-flex px-0">
          <div className="bold blue px-0">Clan:</div>
        </Col>
        <Col xs={9} className="d-inline px-0">
          <TwdSearchFormClan
            value={twdFormState.clan}
            onChange={handleSelectChange}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={{ span: 9, offset: 3 }} className="d-inline px-0">
          <Form.Check
            name="traits"
            value="monoclan"
            type="checkbox"
            id="traits-monoclan"
            label="Mono Clan (any if not selected)"
            checked={twdFormState.traits.monoclan}
            onChange={(e) => handleMultiChange(e)}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={5} className="d-flex px-0">
          <div className="bold blue px-0">Capacity Average:</div>
        </Col>
        <Col xs={7} className="d-flex justify-content-end px-0">
          <TwdSearchFormCapacity
            value={twdFormState.capacity}
            onChange={handleMultiChange}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <div className="bold blue px-0">Library Disciplines:</div>
      </Row>
      <TwdSearchFormDisciplines
        disciplines={twdFormState.disciplines}
        onChange={handleMultiChange}
      />
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={12} className="d-inline pe-0 ps-1">
          <TwdSearchFormCardtypes
            value={twdFormState.cardtypes}
            onChange={handleCardtypeChange}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={3} className="d-flex px-0">
          <div className="bold blue px-0">Event:</div>
        </Col>
        <Col xs={9} className="d-inline px-0">
          <TwdSearchFormEvent
            value={twdFormState.event}
            onChange={handleEventChange}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={3} className="d-flex px-0">
          <div className="bold blue px-0">Location:</div>
        </Col>
        <Col xs={9} className="d-inline px-0">
          <TwdSearchFormLocation
            value={twdFormState.location}
            setValue={setTwdFormState}
          />
        </Col>
      </Row>
      <Row className="py-1 ps-1 mx-0 align-items-center">
        <Col xs={3} className="d-flex px-0">
          <div className="bold blue px-0">Winner:</div>
        </Col>
        <Col xs={9} className="d-inline px-0">
          <TwdSearchFormPlayer
            value={twdFormState.player}
            setValue={setTwdFormState}
          />
        </Col>
      </Row>
      {isMobile && (
        <>
          <div
            onClick={handleClearButton}
            className="d-flex float-right-middle float-clear align-items-center justify-content-center"
          >
            <X viewBox="0 0 16 16" />
          </div>
          <div
            ref={refError}
            onClick={handleSubmitButton}
            className="d-flex float-right-bottom float-search align-items-center justify-content-center"
          >
            {!spinnerState ? (
              <Check2 viewBox="0 0 16 16" className="pt-1" />
            ) : (
              <Spinner animation="border" variant="light" />
            )}
            <ErrorOverlay
              show={showError}
              target={refError.current}
              placement="left"
            >
              NO DECKS FOUND
            </ErrorOverlay>
          </div>
        </>
      )}
    </Form>
  );
}

export default TwdSearchForm;