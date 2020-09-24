import React, { useState, useEffect } from "react";
import { Modal, FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import LoaderButton from "./LoaderButton";
import EditForm from "./EditForm";

export default ({ columns, activePlayers, setActivePlayers, teamId, addingPlayer, setAddingPlayer }) => {
  const [inactivePlayers, setInactivePlayers] = useState([]);
  const [playerIdToAdd, setPlayerIdToAdd] = useState(undefined);
  const [playerLastName, setPlayerLastName] = useState(undefined);
  const [playersWithLastName, setPlayersWithLastName] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectingPlayer, setSelectingPlayer] = useState(false);

  useEffect(() => {
    API.get("atl-backend", "list/inactivePlayer").then(setInactivePlayers);
  }, []);

  const playersNotOnTeam = [...activePlayers, ...inactivePlayers].filter((player) => player.teamId !== teamId);

  const addPlayerToTeam = async (player) => {
    const { playerId } = player;
    if (player.teamId) setPlayerIdToAdd(player.playerId);
    else {
      const activePlayerIndex = activePlayers.findIndex((player) => player.playerId === playerId);
      if (activePlayerIndex > -1) {
        activePlayers[activePlayerIndex].teamId = teamId;
        const body = activePlayers[activePlayerIndex];
        await API.put("atl-backend", `update/player/${playerId}`, { body });
        setActivePlayers([...activePlayers]);
      } else {
        const inactivePlayerIndex = inactivePlayers.findIndex((player) => player.playerId === playerId);
        inactivePlayers[inactivePlayerIndex].teamId = teamId;
        const body = inactivePlayers[inactivePlayerIndex];
        await API.put("atl-backend", `update/inactivePlayer/${playerId}`, { body });
        await API.post("atl-backend", `reactivatePlayer/${playerId}`);
        const updatedActivePlayers = await API.get("atl-backend", "list/player");
        inactivePlayers.splice(inactivePlayerIndex, 1);
        setInactivePlayers([...inactivePlayers]);
        setActivePlayers([...updatedActivePlayers]);
      }
      setAddingPlayer(false);
      setPlayerLastName(undefined);
      setPlayersWithLastName([]);
    }
  };

  const addPlayerFromOtherTeam = async () => {
    setIsLoading(true);
    const index = activePlayers.findIndex((playerInList) => playerInList.playerId === playerIdToAdd);
    activePlayers[index].teamId = teamId;
    await API.put("atl-backend", `update/player/${playerIdToAdd}`, { body: activePlayers[index] });
    const newActivePlayers = await API.get("atl-backend", "list/player");
    setActivePlayers([...newActivePlayers]);
    setPlayerIdToAdd(undefined);
    setAddingPlayer(false);
    setPlayerLastName(undefined);
    setPlayersWithLastName([]);
    setIsLoading(false);
  };

  const renderSearchForm = () => (
    <>
      <form onSubmit={(event) => {
        event.preventDefault();
        setPlayersWithLastName(playersNotOnTeam.filter(
          (player) => playerLastName && player.lastName.toLowerCase().includes(playerLastName.toLowerCase())
        ));
      }}>
        <FormGroup>
          <ControlLabel>Search for a player by last name:</ControlLabel>
          <FormControl
            value={playerLastName || ''}
            type="text"
            onChange={e => setPlayerLastName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="primary"
            type="submit"
          >
            Search
          </LoaderButton>
        </FormGroup>
        {playersWithLastName.length > 0 && (
          <>
            <ControlLabel>Select a player from the list to add them to your team:</ControlLabel>
            <Table columns={columns} rows={playersWithLastName} itemType="player" customSelect={addPlayerToTeam} />
          </>
        )}
      </form>
      {activePlayers.filter((player) => !player.teamId).length > 0 && (
        <>
          <hr />
            <ControlLabel>Or select from the list of players looking for a team:</ControlLabel>
            <Table
              columns={columns}
              rows={activePlayers}
              filterRows={(list) => list.filter((player) => !player.teamId).sort((a, b) => {
                if (!a.rating || a.rating < b.rating) return -1;
                if (!b.rating || a.rating > b.rating) return 1;
                return 0;
              })}
              itemType="player"
              customSelect={addPlayerToTeam}
            />
        </>
      )}
    </>
  );

  const renderConfirmationForm = () => (
    <form>
      <p>
        This player is currently on another team's roster.
        Are you sure you want to remove them from that roster and add them to yours?
      </p>
      <FormGroup>
        <LoaderButton
          block
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          onClick={addPlayerFromOtherTeam}
        >
          Yes
        </LoaderButton>
      </FormGroup>
      <FormGroup>
        <LoaderButton
          block
          bsSize="large"
          onClick={() => { setPlayerIdToAdd(undefined); }}
          className="cancel-button"
        >
          Cancel
        </LoaderButton>
      </FormGroup>
    </form>
  );

  const getFormFields = () => {
    const fields = {};
    Object.keys(columns).forEach((key) => {
      const column = columns[key];
      if (!column.readOnly) {
        if (column.children) {
          column.children.forEach((child) => {
            if (!child.readOnly) fields[child.key] = child;
          });
        } else fields[key] = column;
      }
    });
    return fields;
  };

  const createPlayer = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    body.teamId = teamId;
    await API.post("atl-backend", "createPlayer", { body });
    const updatedActivePlayers = await API.get("atl-backend", "list/player");
    setActivePlayers([...updatedActivePlayers]);
    setIsLoading(false);
    setAddingPlayer(false);
  };

  return (
    <Modal
      className="add-player-modal"
      show={addingPlayer}
      onHide={() => {
        setAddingPlayer(false);
        setSelectingPlayer(false);
      }}
    >
      <Modal.Header closeButton>
        <h2>Add a player</h2>
      </Modal.Header>
      <Modal.Body>
        {!selectingPlayer ? (
          <>
            <LoaderButton
              block
              bsSize="large"
              bsStyle="primary"
              onClick={() => setSelectingPlayer(true)}
              className="select-player"
            >
              Select a player from the database
              <i className="fas fa-arrow-right" />
            </LoaderButton>
            <p className="centered-text">or enter a new player into the database:</p>
            <EditForm
              fields={getFormFields()}
              save={createPlayer}
              isLoading={isLoading}
            />
          </>
        ) : (
          playerIdToAdd ? renderConfirmationForm() : renderSearchForm()
        )}
      </Modal.Body>
    </Modal>
  );
};
