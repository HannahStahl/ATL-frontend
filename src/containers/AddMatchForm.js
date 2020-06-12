import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import { useAppContext } from "../libs/contextLib";
import LoaderButton from "../components/LoaderButton";

export default function AddMatchForm({ hideModal }) {
  const { matches, setMatches } = useAppContext();
  const [match, setMatch] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => (
    match.homeTeamId?.length > 0
    && match.visitorTeamId?.length > 0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await API.post("atl-backend", "create/match", { body: match });
      matches.push(match);
      setMatches([...matches]);
      hideModal();
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader>Add Match</PageHeader>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="homeTeamId">
          <ControlLabel>Home Team</ControlLabel>
          <FormControl
            value={match.homeTeamId || ''}
            type="text"
            onChange={e => setMatch({ ...match, homeTeamId: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="visitorTeamId">
          <ControlLabel>Visiting Team</ControlLabel>
          <FormControl
            value={match.visitorTeamId || ''}
            type="text"
            onChange={e => setMatch({ ...match, visitorTeamId: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="locationId">
          <ControlLabel>Location</ControlLabel>
          <FormControl
            value={match.locationId || ''}
            type="text"
            onChange={e => setMatch({ ...match, locationId: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="weekNumber">
          <ControlLabel>Week</ControlLabel>
          <FormControl
            value={match.weekNumber || ''}
            type="text"
            onChange={e => setMatch({ ...match, weekNumber: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="startTime">
          <ControlLabel>Start Time</ControlLabel>
          <FormControl
            value={match.startTime || ''}
            type="text"
            onChange={e => setMatch({ ...match, startTime: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="singles1HomePlayerId">
          <ControlLabel>Singles #1 Home Player</ControlLabel>
          <FormControl
            value={match.singles1HomePlayerId || ''}
            type="text"
            onChange={e => setMatch({ ...match, singles1HomePlayerId: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="singles1VisitorPlayerId">
          <ControlLabel>Singles #1 Visitor Player</ControlLabel>
          <FormControl
            value={match.singles1VisitorPlayerId || ''}
            type="text"
            onChange={e => setMatch({ ...match, singles1VisitorPlayerId: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="singles2HomePlayerId">
          <ControlLabel>Singles #2 Home Player</ControlLabel>
          <FormControl
            value={match.singles2HomePlayerId || ''}
            type="text"
            onChange={e => setMatch({ ...match, singles2HomePlayerId: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="singles2VisitorPlayerId">
          <ControlLabel>Singles #1 Visitor Player</ControlLabel>
          <FormControl
            value={match.singles2VisitorPlayerId || ''}
            type="text"
            onChange={e => setMatch({ ...match, singles2VisitorPlayerId: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles1HomePlayer1Id">
          <ControlLabel>Doubles #1 Home Player 1</ControlLabel>
          <FormControl
            value={match.doubles1HomePlayer1Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles1HomePlayer1Id: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles1HomePlayer2Id">
          <ControlLabel>Doubles #1 Home Player 2</ControlLabel>
          <FormControl
            value={match.doubles1HomePlayer2Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles1HomePlayer2Id: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles1VisitorPlayer1Id">
          <ControlLabel>Doubles #1 Visitor Player 1</ControlLabel>
          <FormControl
            value={match.doubles1VisitorPlayer1Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles1VisitorPlayer1Id: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles1VisitorPlayer2Id">
          <ControlLabel>Doubles #1 Visitor Player 2</ControlLabel>
          <FormControl
            value={match.doubles1VisitorPlayer2Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles1VisitorPlayer2Id: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles2HomePlayer1Id">
          <ControlLabel>Doubles #2 Home Player 1</ControlLabel>
          <FormControl
            value={match.doubles2HomePlayer1Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles2HomePlayer1Id: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles2HomePlayer2Id">
          <ControlLabel>Doubles #2 Home Player 2</ControlLabel>
          <FormControl
            value={match.doubles2HomePlayer2Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles2HomePlayer2Id: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles2VisitorPlayer1Id">
          <ControlLabel>Doubles #2 Visitor Player 1</ControlLabel>
          <FormControl
            value={match.doubles2VisitorPlayer1Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles2VisitorPlayer1Id: e.target.value })}
          />
        </FormGroup>
        <FormGroup controlId="doubles2VisitorPlayer2Id">
          <ControlLabel>Doubles #2 Visitor Player 2</ControlLabel>
          <FormControl
            value={match.doubles2VisitorPlayer2Id || ''}
            type="text"
            onChange={e => setMatch({ ...match, doubles2VisitorPlayer2Id: e.target.value })}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Submit
        </LoaderButton>
      </form>
    </div>
  );
}
