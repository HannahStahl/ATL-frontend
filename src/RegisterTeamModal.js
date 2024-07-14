import React, { useState } from "react";
import { Modal, FormGroup } from "react-bootstrap";
import { API } from "aws-amplify";
import LoaderButton from "./LoaderButton";

export default ({
  registrationModalVisible, setRegistrationModalVisible, seasonName, team
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const registerTeam = async () => {
    setIsLoading(true);
    await API.put("atl-backend", `update/team/${team.teamId}`, { body: { ...team, isRegistered: true } });
    setIsRegistered(true);
  }

  return (
    <Modal
      show={registrationModalVisible}
      onHide={() => setRegistrationModalVisible(false)}
      className="team-registration-modal"
    >
      <Modal.Body className="centered-text">
        {isRegistered ? (
          <>
            <p>
              Thank you! You may now update your roster and pay for the <b>{seasonName}</b> season.
            </p>
            <FormGroup>
              <a href="/payment">
                <LoaderButton
                  block
                  bsSize="large"
                  bsStyle="primary"
                >
                  Continue
                </LoaderButton>
              </a>
            </FormGroup>
          </>
        ) : (
          <>
            <p>
              I hereby register my team for the <b>{seasonName}</b> season of the Austin Tennis League.
            </p>
            <FormGroup>
              <LoaderButton
                block
                bsSize="large"
                bsStyle="primary"
                isLoading={isLoading}
                onClick={registerTeam}
              >
                Continue
              </LoaderButton>
            </FormGroup>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
