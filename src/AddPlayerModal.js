import React, { useState } from "react";
import { Modal, FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import LoaderButton from "./LoaderButton";

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
      const index = allPlayers.findIndex((playerInList) => playerInList.playerId === playerId);
      allPlayers[index].teamId = teamId;
      await API.put("atl-backend", `update/player/${playerId}`, { body: allPlayers[index] });
      setAllPlayers([...allPlayers]);
      setAddingPlayer(false);
      setPlayerLastName(undefined);
      setPlayersWithLastName([]);
    }
  };

  const addPlayerFromOtherTeam = async () => {
    setIsLoading(true);
    const index = allPlayers.findIndex((playerInList) => playerInList.playerId === playerIdToAdd);
    allPlayers[index].teamId = teamId;
    await API.put("atl-backend", `update/player/${playerIdToAdd}`, { body: allPlayers[index] });
    const newAllPlayers = await API.get("atl-backend", "list/player");
    setAllPlayers([...newAllPlayers]);
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
          <>
            <p>Select a player from the list to add them to your team.</p>
            <Table columns={columns} rows={playersWithLastName} itemType="player" customSelect={addPlayerToTeam} />
          </>
        )}
      </form>
      <hr />
      <ControlLabel>Or select from the list of players looking for a team:</ControlLabel>
      <Table
        columns={columns}
        rows={allPlayers}
        filterRows={(list) => list.filter((player) => !player.teamId)}
        itemType="player"
        customSelect={addPlayerToTeam}
      />
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
