import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Matches.css";
import Match from "./Match";

export default function Schedule() {
  const { team, allTeams, matches, setMatches, locations, allPlayers } = useAppContext();
  let schedule = [];
  const { teamId } = team;
  if (teamId) {
    schedule = matches.filter((match) => match.homeTeamId === teamId || match.visitorTeamId === teamId);
  }
  const [matchSelected, setMatchSelected] = useState(undefined);
  const [newMatchSelected, setNewMatchSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const editMatch = async (event, updatedMatch) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.put("atl-backend", `update/match/${updatedMatch.matchId}`, { body: updatedMatch });
    const index = matches.findIndex((matchInList) => matchInList.matchId === updatedMatch.matchId);
    matches[index] = result;
    setMatches([...matches]);
    setIsLoading(false);
    setMatchSelected(undefined);
  };

  const addMatch = async (event, newMatch) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.post("atl-backend", "create/match", { body: newMatch });
    matches.push(result);
    setMatches([...matches]);
    setIsLoading(false);
    setNewMatchSelected(false);
  };

  const columns = {
    "weekNumber": "Week",
    homeTeamId: "Home Team",
    visitorTeamId: "Visiting Team",
    locationId: "Location",
    "startTime": "Start Time",
    "singles1HomePlayerId": "Home Team #1 Singles Player",
    "singles1VisitorPlayerId": "Visiting Team #1 Singles Player",
    "singles2HomePlayerId": "Home Team #2 Singles Player",
    "singles2VisitorPlayerId": "Visiting Team #2 Singles Player",
    "doubles1HomePlayer1Id": "Home Team #1 Doubles Player 1",
    "doubles1HomePlayer2Id": "Home Team #1 Doubles Player 2",
    "doubles1VisitorPlayer1Id": "Visiting Team #1 Doubles Player 1",
    "doubles1VisitorPlayer2Id": "Visiting Team #1 Doubles Player 2",
    "doubles2HomePlayer1Id": "Home Team #2 Doubles Player 1",
    "doubles2HomePlayer2Id": "Home Team #2 Doubles Player 2",
    "doubles2VisitorPlayer1Id": "Visiting Team #2 Doubles Player 1",
    "doubles2VisitorPlayer2Id": "Visiting Team #2 Doubles Player 2",
    "singles1Score": "#1 Singles Score",
    "singles2Score": "#2 Singles Score",
    "doubles1Score": "#1 Doubles Score",
    "doubles2Score": "#2 Doubles Score",
    "singles1HomeSetsWon": "Home Team #1 Singles Sets Won",
    "singles1VisitorSetsWon": "Visiting Team #1 Singles Sets Won",
    "singles2HomeSetsWon": "Home Team #2 Singles Sets Won",
    "singles2VisitorSetsWon": "Visiting Team #2 Singles Sets Won",
    "doubles1HomeSetsWon": "Home Team #1 Doubles Sets Won",
    "doubles1VisitorSetsWon": "Visiting Team #1 Doubles Sets Won",
    "doubles2HomeSetsWon": "Home Team #2 Doubles Sets Won",
    "doubles2VisitorSetsWon": "Visiting Team #2 Doubles Sets Won",
    "totalHomeSetsWon": "Home Team Total Sets Won",
    "totalVisitorSetsWon": "Visiting Team Total Sets Won"
  };

  return (
    <div>
      <PageHeader>Match Schedule</PageHeader>
      <div className="Matches">
        <Table bordered hover>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
            </tr>
          </thead>
          <tbody>
            {schedule.map((match) => (
              <tr key={match.matchId} onClick={() => setMatchSelected(match)}>
                {Object.keys(columns).map((key) => {
                  let value = match[key];
                  if (value) {
                    if (key === "homeTeamId" || key === "visitorTeamId") {
                      value = allTeams.find((team) => team.teamId === value)?.teamName || "";
                    } else if (key === "locationId") {
                      value = locations.find((location) => location.locationId === value)?.locationName || "";
                    } else if (key.includes("Player")) {
                      const player = allPlayers.find((player) => player.playerId === value);
                      value = player ? `${player.firstName} ${player.lastName}` : "";
                    }
                  }
                  return <td key={key}>{value || ""}</td>;
                })}
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length} onClick={() => setNewMatchSelected(true)}>
                + Add new match
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={matchSelected !== undefined} onHide={() => setMatchSelected(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Match Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Match
            originalMatch={matchSelected}
            saveMatch={editMatch}
            isLoading={isLoading}
            allTeams={allTeams}
            locations={locations}
            allPlayers={allPlayers}
          />
        </Modal.Body>
      </Modal>
      <Modal show={newMatchSelected} onHide={() => setNewMatchSelected(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Match</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Match
            saveMatch={addMatch}
            isLoading={isLoading}
            allTeams={allTeams}
            locations={locations}
            allPlayers={allPlayers}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
