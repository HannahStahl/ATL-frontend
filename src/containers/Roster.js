import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal, FormControl } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Roster.css";
import Player from "./Player";
import LoaderButton from "../components/LoaderButton";

export default function Roster() {
  const { team, allPlayers, setAllPlayers } = useAppContext();
  const { teamId } = team;
  const [roster, setRoster] = useState([]);
  const [playerSelected, setPlayerSelected] = useState(undefined);
  const [newPlayerIdSelected, setNewPlayerIdSelected] = useState("");
  const [playerSelectedForRemoval, setPlayerSelectedForRemoval] = useState(undefined);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (teamId) setRoster(allPlayers.filter((player) => player.teamId === teamId));
  }, [teamId, allPlayers]);

  const columns = {
    firstName: "First Name",
    lastName: "Last Name",
    "phone": "Phone",
    "email": "Email",
    "rating": "Rating",
    "selfRated": "Self-Rated?",
    "gender": "Gender",
    "birthYear": "Birth Year",
    "comments": "Comments"
  };

  const addPlayerToRoster = async (e) => {
    const playerId = e.target.value;
    setNewPlayerIdSelected(playerId);
    if (playerId.length > 0) {
      const index = allPlayers.findIndex((playerInList) => playerInList.playerId === playerId);
      const player = allPlayers[index];
      const updatedPlayer = { ...player, teamId };
      await API.put("atl-backend", `update/player/${playerId}`, {
        body: updatedPlayer
      });
      allPlayers[index] = updatedPlayer;
      setAllPlayers([...allPlayers]);
      setNewPlayerIdSelected("");
    }
  };

  const updatePlayer = (updatedPlayer) => {
    const index = roster.findIndex((player) => player.playerId === playerSelected.playerId);
    roster[index] = updatedPlayer;
    setRoster([...roster]);
    setPlayerSelected(undefined);
  };

  const removePlayerFromRoster = async () => {
    setRemoving(true);
    await API.put("atl-backend", `update/player/${playerSelectedForRemoval.playerId}`, {
      body: {
        ...playerSelectedForRemoval,
        teamId: null,
      },
    });
    const index = roster.findIndex((player) => player.playerId === playerSelectedForRemoval.playerId);
    roster.splice(index, 1);
    setRoster([...roster]);
    setPlayerSelectedForRemoval(undefined);
    setRemoving(false);
  };

  return (
    <div>
      <PageHeader>Team Roster</PageHeader>
      <div className="Roster">
        <Table bordered hover>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => (
                <th key={key}>{columns[key]}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {roster.map((player) => (
              <tr
                key={player.playerId}
                onClick={(e) => {
                  if (!e.target.className.includes("fas")) setPlayerSelected(player);
                }}
              >
                {Object.keys(columns).map((key) => (
                  <td key={key}>{player[key]}</td>
                ))}
                <td><i className="fas fa-times-circle" onClick={() => setPlayerSelectedForRemoval(player)} /></td>
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length + 1}>
                <FormControl
                  componentClass="select"
                  value={newPlayerIdSelected}
                  onChange={addPlayerToRoster}
                >
                  <option value="">+ Add new player</option>
                  {allPlayers.map((player) => (
                    <option key={player.playerId} value={player.playerId}>{`${player.firstName} ${player.lastName}`}</option>
                  ))}
                </FormControl>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={playerSelected !== undefined} onHide={() => setPlayerSelected(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Player Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Player playerDetails={playerSelected} onFinish={updatePlayer} />
        </Modal.Body>
      </Modal>
      <Modal show={playerSelectedForRemoval !== undefined} onHide={() => setPlayerSelectedForRemoval(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {playerSelectedForRemoval && (
            <>
              <p>{`Are you sure you want to remove ${playerSelectedForRemoval.firstName} ${playerSelectedForRemoval.lastName} from your roster?`}</p>
              <LoaderButton
                block
                bsSize="large"
                bsStyle="primary"
                isLoading={removing}
                onClick={removePlayerFromRoster}
              >
                Yes, remove
              </LoaderButton>
              <LoaderButton
                block
                bsSize="large"
                onClick={() => setPlayerSelectedForRemoval(undefined)}
              >
                Cancel
              </LoaderButton>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
