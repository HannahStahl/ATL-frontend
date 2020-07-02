import React from "react";
import { Modal } from "react-bootstrap";
import { LoaderButton } from "atl-components";

export default ({
  playerIdToAdd, setPlayerIdToAdd, isLoading, addPlayerFromOtherTeam, setDropdownOptionSelected
}) => (
  <Modal show={playerIdToAdd !== undefined} onHide={() => setPlayerIdToAdd(undefined)}>
    <Modal.Header closeButton>
      <Modal.Title>Confirmation</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        This player is currently on another team's roster. Are you sure you want to remove them from that roster and add them to yours?
      </p>
      <LoaderButton
        block
        bsSize="large"
        bsStyle="primary"
        isLoading={isLoading}
        onClick={addPlayerFromOtherTeam}
      >
        Yes
      </LoaderButton>
      <LoaderButton
        block
        bsSize="large"
        onClick={() => {
          setPlayerIdToAdd(undefined);
          setDropdownOptionSelected("");
        }}
      >
        Cancel
      </LoaderButton>
    </Modal.Body>
  </Modal>
);
