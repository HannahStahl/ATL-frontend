import React, { useState } from "react";
import { API } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { PageHeader, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import { useAppContext } from "../libs/contextLib";
import LoaderButton from "../components/LoaderButton";

export default function Team() {
  const history = useHistory();
  const { profile, team, setTeam, allCaptains, locations, divisions } = useAppContext();
  const { captainId } = profile;
  const [newTeam, setNewTeam] = useState(team);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => newTeam.teamName?.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (team.teamId) {
        await API.put("atl-backend", `update/team/${newTeam.teamId}`, {
          body: newTeam
        });
        setTeam(newTeam);
      } else {
        await API.post("atl-backend", "create/team", {
          body: { ...newTeam, captainId }
        });
        setTeam(newTeam);
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
          <FormGroup controlId="cocaptain">
            <ControlLabel>Co-Captain</ControlLabel>
            <FormControl
              value={newTeam.cocaptainId || ""}
              componentClass="select"
              onChange={e => setNewTeam({ ...newTeam, cocaptainId: e.target.value })}
            >
              <option value="" />
              {allCaptains.filter((captain) => captain.captainId !== captainId).map((captain) => (
                <option key={captain.captainId} value={captain.captainId}>
                  {`${captain.firstName} ${captain.lastName}`}
                </option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="division">
            <ControlLabel>Division</ControlLabel>
            <FormControl
              value={newTeam.divisionId || ''}
              componentClass="select"
              onChange={e => setNewTeam({ ...newTeam, divisionId: e.target.value })}
            >
              <option value="" />
              {divisions.map((division) => (
                <option key={division.divisionId} value={division.divisionId}>
                  {division.divisionNumber}
                </option>
              ))}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="location">
            <ControlLabel>Location</ControlLabel>
            <FormControl
              value={newTeam.locationId || ''}
              componentClass="select"
              onChange={e => setNewTeam({ ...newTeam, locationId: e.target.value })}
            >
              <option value="" />
              {locations.map((location) => (
                <option key={location.locationId} value={location.locationId}>
                  {location.locationName}
                </option>
              ))}
            </FormControl>
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
