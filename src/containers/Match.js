import React, { useState } from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default ({
  originalMatch, saveMatch, isLoading, allTeams, locations, allPlayers
}) => {
  const [match, setMatch] = useState(originalMatch || {});

  const validateForm = () => match.homeTeamId?.length > 0 && match.visitorTeamId?.length > 0;

  const playerFields = [
    { id: "singles1HomePlayerId", label: "Home Team #1 Singles Player" },
    { id: "singles1VisitorPlayerId", label: "Visiting Team #1 Singles Player" },
    { id: "singles2HomePlayerId", label: "Home Team #2 Singles Player" },
    { id: "singles2VisitorPlayerId", label: "Visiting Team #2 Singles Player" },
    { id: "doubles1HomePlayer1Id", label: "Home Team #1 Doubles Player 1" },
    { id: "doubles1HomePlayer2Id", label: "Home Team #1 Doubles Player 2" },
    { id: "doubles1VisitorPlayer1Id", label: "Visiting Team #1 Doubles Player 1" },
    { id: "doubles1VisitorPlayer2Id", label: "Visiting Team #1 Doubles Player 2" },
    { id: "doubles2HomePlayer1Id", label: "Home Team #2 Doubles Player 1" },
    { id: "doubles2HomePlayer2Id", label: "Home Team #2 Doubles Player 2" },
    { id: "doubles2VisitorPlayer1Id", label: "Visiting Team #2 Doubles Player 1" },
    { id: "doubles2VisitorPlayer2Id", label: "Visiting Team #2 Doubles Player 2" },
  ];

  return (
    <form onSubmit={(e) => saveMatch(e, match)}>
      <FormGroup controlId="homeTeamId">
        <ControlLabel>Home Team</ControlLabel>
        <FormControl
          value={match.homeTeamId || ''}
          componentClass="select"
          onChange={e => setMatch({ ...match, homeTeamId: e.target.value })}
        >
          <option value="" />
          {allTeams.map((team) => (
            <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
          ))}
        </FormControl>
      </FormGroup>
      <FormGroup controlId="visitorTeamId">
        <ControlLabel>Visiting Team</ControlLabel>
        <FormControl
          value={match.visitorTeamId || ""}
          componentClass="select"
          onChange={e => setMatch({ ...match, visitorTeamId: e.target.value })}
        >
          <option value="" />
          {allTeams.map((team) => (
            <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
          ))}
        </FormControl>
      </FormGroup>
      <FormGroup controlId="locationId">
        <ControlLabel>Location</ControlLabel>
        <FormControl
          value={match.locationId || ""}
          componentClass="select"
          onChange={e => setMatch({ ...match, locationId: e.target.value })}
        >
          <option value="" />
          {locations.map((location) => (
            <option key={location.locationId} value={location.locationId}>{location.locationName}</option>
          ))}
        </FormControl>
      </FormGroup>
      <FormGroup controlId="weekNumber">
        <ControlLabel>Week</ControlLabel>
        <FormControl
          value={match.weekNumber || ""}
          type="text"
          onChange={e => setMatch({ ...match, weekNumber: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="startTime">
        <ControlLabel>Start Time</ControlLabel>
        <FormControl
          value={match.startTime || ""}
          type="text"
          onChange={e => setMatch({ ...match, startTime: e.target.value })}
        />
      </FormGroup>
      {/* TODO should only show players for selected home/visitor team */}
      {playerFields.map((playerField) => (
        <FormGroup key={playerField.id} controlId={playerField.id}>
          <ControlLabel>{playerField.label}</ControlLabel>
          <FormControl
            value={match[playerField.id] || ""}
            componentClass="select"
            onChange={e => setMatch({ ...match, [playerField.id]: e.target.value })}
          >
            <option value="" />
            {allPlayers.map((player) => (
              <option key={player.playerId} value={player.playerId}>
                {`${player.firstName} ${player.lastName}`}
              </option>
            ))}
          </FormControl>
        </FormGroup>
      ))}
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        bsStyle="primary"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Save
      </LoaderButton>
    </form>
  );
};
