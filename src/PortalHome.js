import React, { useState } from "react";
import { API } from "aws-amplify";
import { FormControl, FormGroup, PageHeader, Radio } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import config from "./config";
import LoaderButton from "./LoaderButton";

export default function PortalHome() {
  const { allTeams, profile, setProfile, loadingData } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([""]);
  const [captainOfTeams, setCaptainOfTeams] = useState([true]);
  const [teamName, setTeamName] = useState("");

  function validateForm() {
    return (
      accessCode.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      phone.length > 0
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const accessCodes = [
      process.env.REACT_APP_CAPTAIN_ACCESS_CODE,
      process.env.REACT_APP_ADMIN_ACCESS_CODE,
      process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE,
    ];
    if (!accessCodes.includes(accessCode)) {
      onError("Invalid access code");
      setIsLoading(false);
    } else {
      try {
        const isCaptain = (
          accessCode === process.env.REACT_APP_CAPTAIN_ACCESS_CODE ||
          accessCode === process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE
        );
        const isAdmin = (
          accessCode === process.env.REACT_APP_ADMIN_ACCESS_CODE ||
          accessCode === process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE
        );
        const userBody = { firstName, lastName, email: profile.email, phone, isCaptain, isAdmin };
        const user = await API.post("atl-backend", "create/user", { body: userBody });
        const teamPromises = [];
        selectedTeams.forEach((selectedTeam, index) => {
          if (selectedTeam.length > 0) {
            const teamBody = allTeams.find((team) => team.teamId === selectedTeam);
            if (captainOfTeams[index]) teamBody.captainId = user.userId;
            else teamBody.cocaptainId = user.userId;
            teamPromises.push(API.put("atl-backend", `update/team/${selectedTeam}`, { body: teamBody }));
          }
        });
        await Promise.all(teamPromises);
        const needsToBeAddedToTeam = isCaptain && (
          teamPromises.length === 0 || // They didn't select a team to add themselves to, OR
          teamName.length > 0 // They entered a team that doesn't exist yet (needs to be created)
        );
        if (needsToBeAddedToTeam) {
          await API.post("atl-backend", "emailAdmin", {
            body: { ...userBody, teamName, adminEmail: config.adminEmail, url: window.location.origin }
          });
        }
        setProfile(user);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return <div className="container" />;
  }

  if (!(profile?.userId)) {
    return (
      <div className="container">
        <PageHeader>Create your Profile</PageHeader>
        <form onSubmit={handleSubmit} className="max-width-form">
          <table className="form-table">
            <tbody>
              <tr>
                <td className="form-label">Access Code</td>
                <td className="form-field">
                  <FormControl
                    autoFocus
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="form-label">First Name</td>
                <td className="form-field">
                  <FormControl
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="form-label">Last Name</td>
                <td className="form-field">
                  <FormControl
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="form-label">Phone</td>
                <td className="form-field">
                  <FormControl
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="xxx-xxx-xxxx"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          <p className="centered-text">Are you the captain/co-captain of any existing teams?</p>
          {selectedTeams.map((selectedTeam, index) => (
            <React.Fragment key={selectedTeam}>
              <FormGroup>
                <FormControl
                  value={selectedTeams[index]}
                  componentClass="select"
                  onChange={(e) => {
                    selectedTeams[index] = e.target.value;
                    setSelectedTeams([...selectedTeams]);
                  }}
                >
                  <option value="">Select team</option>
                  {allTeams
                    .filter((team) => team.isActive && team.teamName !== "Bye")
                    .sort((a, b) => a.teamName.toLowerCase() < b.teamName.toLowerCase() ? -1 : 1)
                    .map((team) => <option key={team.teamId} value={team.teamId}>{team.teamName}</option>)
                  }
                </FormControl>
              </FormGroup>
              {selectedTeams[index].length > 0 && (
                <div className="centered-content">
                  <FormGroup>
                    <Radio
                      inline
                      checked={captainOfTeams[index]}
                      onChange={() => {
                        captainOfTeams[index] = !captainOfTeams[index];
                        setCaptainOfTeams([...captainOfTeams]);
                      }}
                    >
                      Captain
                    </Radio>
                    <Radio
                      inline
                      checked={!captainOfTeams[index]}
                      onChange={() => {
                        captainOfTeams[index] = !captainOfTeams[index];
                        setCaptainOfTeams([...captainOfTeams]);
                      }}
                    >
                      Co-captain
                    </Radio>
                  </FormGroup>
                </div>
              )}
            </React.Fragment>
          ))}
          {selectedTeams[selectedTeams.length - 1].length > 0 && (
            <div className="centered-content">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="link"
                onClick={() => {
                  setSelectedTeams([...selectedTeams, ""]);
                  setCaptainOfTeams([...captainOfTeams, true]);
                }}
              >
                + Add another team
              </a>
            </div>
          )}
          <hr />
          <p className="centered-text">Team not in the list above? Enter your team name here:</p>
          <table className="form-table">
            <tbody>
              <tr>
                <td className="form-label">Team Name</td>
                <td className="form-field">
                  <FormControl
                    type="text"
                    onChange={(e) => setTeamName(e.target.value)}
                    value={teamName}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Create Profile
          </LoaderButton>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader>
        {profile.isAdmin ? "Welcome to the ATL Admin Portal." : "Welcome to the Captain's Corner!"}
      </PageHeader>
      <p className="link-below-button">
        Click the icon in the top right to view your profile and league information.
      </p>
    </div>
  );
}
