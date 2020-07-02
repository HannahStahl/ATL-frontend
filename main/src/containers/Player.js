import React, { useState } from "react";
import { API } from "aws-amplify";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { LoaderButton } from "atl-components";
import { onError } from "../libs/errorLib";

export default function Player({ playerDetails, onFinish }) {
  const [player, setPlayer] = useState(playerDetails || {});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => (
    player.firstName?.length > 0
    && player.lastName?.length > 0
    && player.email?.length > 0
    && player.rating?.length > 0
    && player.gender?.length > 0
    && player.birthYear?.length > 0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (player.playerId) {
        await API.put("atl-backend", `update/player/${player.playerId}`, { body: player });
      } else {
        await API.post("atl-backend", "createPlayer", { body: player });
      }
      if (onFinish) onFinish(player);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup controlId="firstName">
        <ControlLabel>First Name</ControlLabel>
        <FormControl
          value={player.firstName || ''}
          type="text"
          onChange={e => setPlayer({ ...player, firstName: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="lastName">
        <ControlLabel>Last Name</ControlLabel>
        <FormControl
          value={player.lastName || ''}
          type="text"
          onChange={e => setPlayer({ ...player, lastName: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="phone">
        <ControlLabel>Phone</ControlLabel>
        <FormControl
          value={player.phone || ''}
          type="text"
          onChange={e => setPlayer({ ...player, phone: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="email">
        <ControlLabel>Email</ControlLabel>
        <FormControl
          value={player.email || ''}
          type="email"
          onChange={e => setPlayer({ ...player, email: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="rating">
        <ControlLabel>NTRP Rating</ControlLabel>
        <FormControl
          value={player.rating || ''}
          type="text"
          onChange={e => setPlayer({ ...player, rating: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="selfRated">
        <ControlLabel>Self-Rated?</ControlLabel>
        <FormControl
          value={player.selfRated || ''}
          type="text" // TODO change to checkbox
          onChange={e => setPlayer({ ...player, selfRated: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="gender">
        <ControlLabel>Gender</ControlLabel>
        <FormControl
          value={player.gender || ''}
          type="text"
          onChange={e => setPlayer({ ...player, gender: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="birthYear">
        <ControlLabel>Year of Birth</ControlLabel>
        <FormControl
          value={player.birthYear || ''}
          type="text"
          onChange={e => setPlayer({ ...player, birthYear: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="usta">
        <ControlLabel>Have you played USTA?</ControlLabel>
        <FormControl
          value={player.usta || ''}
          type="text" // TODO change to checkbox
          onChange={e => setPlayer({ ...player, usta: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="ustaLevel">
        <ControlLabel>If so, what level of USTA did you play?</ControlLabel>
        <FormControl
          value={player.ustaLevel || ''}
          type="text"
          onChange={e => setPlayer({ ...player, ustaLevel: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="ustaYear">
        <ControlLabel>What year did you last play USTA?</ControlLabel>
        <FormControl
          value={player.ustaYear || ''}
          type="text"
          onChange={e => setPlayer({ ...player, ustaYear: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="experience">
        <ControlLabel>Experience</ControlLabel>
        <FormControl
          value={player.experience || ''}
          componentClass="textarea"
          rows="3"
          onChange={e => setPlayer({ ...player, experience: e.target.value })}
        />
      </FormGroup>
      <FormGroup controlId="comments">
        <ControlLabel>Comments</ControlLabel>
        <FormControl
          value={player.comments || ''}
          componentClass="textarea"
          rows="3"
          onChange={e => setPlayer({ ...player, comments: e.target.value })}
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
        {player.playerId ? 'Save' : 'Submit'}
      </LoaderButton>
    </form>
  );
}
