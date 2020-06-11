import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import "./Roster.css";

export default function Roster() {
  const [roster, setRoster] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerSelected, setPlayerSelected] = useState(undefined);

  useEffect(() => {
    async function onLoad() {
      try {
        // TODO move all API calls to App.js
        const [teams, players] = await Promise.all([
          API.get("atl-backend", "list/team"),
          API.get("atl-backend", "list/player") // TODO change backend call to return all players, not just ones for this captain
        ]);
        const team = teams[0];
        let playersOnTeam = [];
        if (team) {
          playersOnTeam = players.filter((player) => player.teamId === team.teamId);
        }
        setRoster(playersOnTeam);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, []);

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

  return (
    <div>
      <PageHeader>Team Roster</PageHeader>
      {!isLoading && (
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
                <tr onClick={() => setPlayerSelected(player)}>
                  {Object.keys(columns).map((key) => (
                    <td key={key}>{player[key]}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan={Object.keys(columns).length}>+ Add new player</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
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
