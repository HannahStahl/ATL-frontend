import React, { useState } from "react";
import { Modal, FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table, LoaderButton } from "atl-components";

export default ({ columns, allPlayers, setAllPlayers, teamId, addingPlayer, setAddingPlayer }) => {
  const [playerIdToAdd, setPlayerIdToAdd] = useState(undefined);
  const [playerLastName, setPlayerLastName] = useState(undefined);
  const [playersWithLastName, setPlayersWithLastName] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const playersNotOnTeam = allPlayers.filter((player) => player.teamId !== teamId);

  const addPlayerToTeam = async (player) => {
    const { playerId } = player;
    if (player.teamId) setPlayerIdToAdd(player.playerId);
    else {
      const body = { ...player, teamId }
      await API.put("atl-backend", `update/player/${playerId}`, { body });
      const newAllPlayers = await API.get("atl-backend", "list/player");
      setAllPlayers([...newAllPlayers]);
      setAddingPlayer(false);
      setPlayerLastName(undefined);
      setPlayersWithLastName([]);
    }
  };

  const addPlayerFromOtherTeam = async () => {
    setIsLoading(true);
    const index = allPlayers.findIndex((rowInList) => rowInList.playerId === playerIdToAdd);
    const player = allPlayers[index];
    const body = { ...player, teamId }
    await API.put("atl-backend", `update/player/${playerIdToAdd}`, { body });
    const newAllPlayers = await API.get("atl-backend", "list/player");
    setAllPlayers([...newAllPlayers]);
    setPlayerIdToAdd(undefined);
    setAddingPlayer(false);
    setPlayerLastName(undefined);
    setPlayersWithLastName([]);
    setIsLoading(false);
  };

  const renderSearchForm = () => (
    <form onSubmit={(event) => {
      event.preventDefault();
      setPlayersWithLastName(playersNotOnTeam.filter(
        (player) => player.lastName.toLowerCase().includes(playerLastName.toLowerCase())
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
        <React.Fragment>
          <p>Select a player from the list to add them to your team.</p>
          <Table columns={columns} rows={playersWithLastName} itemType="player" customSelect={addPlayerToTeam} />
        </React.Fragment>
      )}
    </form>
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
        >
          Cancel
        </LoaderButton>
      </FormGroup>
    </form>
  );

  return (
    <Modal show={addingPlayer} onHide={() => setAddingPlayer(false)}>
      <Modal.Header closeButton>
        <h2>Add new player</h2>
      </Modal.Header>
      <Modal.Body>
        {playerIdToAdd ? renderConfirmationForm() : renderSearchForm()}
      </Modal.Body>
    </Modal>
  );
};
