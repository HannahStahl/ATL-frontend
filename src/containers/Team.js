import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { PageHeader, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import LoaderButton from "../components/LoaderButton";

export default function Team() {
  const history = useHistory();
  const [oldTeam, setOldTeam] = useState({});
  const [newTeam, setNewTeam] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      try {
        const teams = await API.get("atl-backend", "list/team");
        const team = teams[0];
        setOldTeam(team || {});
        setNewTeam(team || {});
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, []);

  const validateForm = () => newTeam.teamName?.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (oldTeam.teamId) {
        await API.put("atl-backend", "update/team", {
          body: newTeam
        });
      } else {
        await API.post("atl-backend", "create/team", {
          body: newTeam
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
      <PageHeader>Team Details</PageHeader>
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="teamName">
            <ControlLabel>Team Name</ControlLabel>
            <FormControl
              value={newTeam.teamName || ''}
              type="text"
              onChange={e => setNewTeam({ ...newTeam, teamName: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="division">
            <ControlLabel>Division</ControlLabel>
            <FormControl
              value={newTeam.divisionId || ''}
              type="text"
              onChange={e => setNewTeam({ ...newTeam, divisionId: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="location">
            <ControlLabel>Location</ControlLabel>
            <FormControl
              value={newTeam.locationId || ''}
              type="text"
              onChange={e => setNewTeam({ ...newTeam, locationId: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="courtNumber">
            <ControlLabel>Court Number</ControlLabel>
            <FormControl
              value={newTeam.courtNumber || ''}
              type="text"
              onChange={e => setNewTeam({ ...newTeam, courtNumber: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="courtTime">
            <ControlLabel>Court Time</ControlLabel>
            <FormControl
              value={newTeam.courtTime || ''}
              type="text"
              onChange={e => setNewTeam({ ...newTeam, courtTime: e.target.value })}
            />
          </FormGroup>
          <FormGroup controlId="comments">
            <ControlLabel>Comments</ControlLabel>
            <FormControl
              value={newTeam.comments || ''}
              componentClass="textarea"
              rows="3"
              onChange={e => setNewTeam({ ...newTeam, comments: e.target.value })}
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
            Save Team Details
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
