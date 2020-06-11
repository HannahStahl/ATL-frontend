import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { PageHeader, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import LoaderButton from "../components/LoaderButton";

export default function Profile() {
  const history = useHistory();
  const [oldProfile, setOldProfile] = useState({});
  const [newProfile, setNewProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      try {
        const profiles = await API.get("atl-backend", "list/captain");
        const profile = profiles[0];
        setOldProfile(profile || {});
        setNewProfile(profile || {});
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, []);

  const validateForm = () => (
    newProfile.firstName?.length > 0
    && newProfile.lastName?.length > 0
    && newProfile.phone?.length > 0
    && newProfile.email?.length > 0
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (oldProfile.captainId) {
        await API.put("atl-backend", "update/captain", {
          body: newProfile
        });
      } else {
        await API.post("atl-backend", "create/captain", {
          body: newProfile
        });
      }
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
          <FormGroup controlId="email">
            <ControlLabel>Email Address</ControlLabel>
            <FormControl
              value={newProfile.email || ''}
              type="text"
              onChange={e => setNewProfile({ ...newProfile, email: e.target.value })}
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
