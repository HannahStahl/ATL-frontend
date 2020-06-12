import React, { useState } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { PageHeader, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import { useAppContext } from "../libs/contextLib";
import LoaderButton from "../components/LoaderButton";

export default function Profile() {
  const history = useHistory();
  const { profile, setProfile } = useAppContext();
  const [newProfile, setNewProfile] = useState(profile);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => (
    newProfile.firstName?.length > 0
    && newProfile.lastName?.length > 0
    && newProfile.phone?.length > 0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await API.put("atl-backend", `update/captain/${newProfile.captainId}`, {
        body: newProfile
      });
      setProfile(newProfile);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader>Your Profile</PageHeader>
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="firstName">
            <ControlLabel>First Name</ControlLabel>
            <FormControl
              value={newProfile.firstName || ''}
              type="text"
              onChange={e => setNewProfile({ ...newProfile, firstName: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="lastName">
            <ControlLabel>Last Name</ControlLabel>
            <FormControl
              value={newProfile.lastName || ''}
              type="text"
              onChange={e => setNewProfile({ ...newProfile, lastName: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="phone">
            <ControlLabel>Phone Number</ControlLabel>
            <FormControl
              value={newProfile.phone || ''}
              type="text"
              onChange={e => setNewProfile({ ...newProfile, phone: e.target.value })}
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
            Save Profile
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
