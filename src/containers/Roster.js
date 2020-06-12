import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal, FormControl } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Roster.css";

export default function Roster() {
  const { team, allPlayers, setAllPlayers } = useAppContext();
  const { teamId } = team;
  const [roster, setRoster] = useState([]);
  const [playerSelected, setPlayerSelected] = useState(undefined);
  const [newPlayerIdSelected, setNewPlayerIdSelected] = useState("");

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
    "birthYear": "Birth Year", // TODO transform to Age
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
            </tr>
          </thead>
          <tbody>
            {roster.map((player) => (
              <tr key={player.playerId} onClick={() => setPlayerSelected(player)}>
                {Object.keys(columns).map((key) => (
                  <td key={key}>{player[key]}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length}>
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
          <p>Insert form here</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
