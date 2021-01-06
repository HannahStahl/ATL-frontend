import React, { useState } from "react";
import { Auth, API } from "aws-amplify";
import { DateUtils } from '@aws-amplify/core';
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, PageHeader, HelpBlock, Radio } from "react-bootstrap";
import LoaderButton from "./LoaderButton";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import config from "./config";

export default function Signup() {
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated, allTeams } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([""]);
  const [captainOfTeams, setCaptainOfTeams] = useState([true]);
  const [teamName, setTeamName] = useState("");

  function validateForm() {
    return (
      accessCode.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      phone.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    );
  }

  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
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
    } else if (password !== confirmPassword) {
      onError("Passwords do not match");
      setIsLoading(false);
    } else {
      try {
        const newUser = await Auth.signUp({
          username: email, password: password, validationData: [{ Name: "accessCode", Value: accessCode }]
        });
        setIsLoading(false);
        setNewUser(newUser);
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      await Auth.currentAuthenticatedUser({
        bypassCache: true
      }).then((user) => {
        DateUtils.setClockOffset(-(user.signInUserSession.clockDrift * 1000));
      });
      const isCaptain = (
        accessCode === process.env.REACT_APP_CAPTAIN_ACCESS_CODE ||
        accessCode === process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE
      );
      const isAdmin = (
        accessCode === process.env.REACT_APP_ADMIN_ACCESS_CODE ||
        accessCode === process.env.REACT_APP_ADMIN_CAPTAIN_ACCESS_CODE
      );
      const userBody = { firstName, lastName, email, phone, isCaptain, isAdmin };
      const { userId } = await API.post("atl-backend", "create/user", { body: userBody });
      const teamPromises = [];
      selectedTeams.forEach((selectedTeam, index) => {
        if (selectedTeam.length > 0) {
          const teamBody = allTeams.find((team) => team.teamId === selectedTeam);
          if (captainOfTeams[index]) teamBody.captainId = userId;
          else teamBody.cocaptainId = userId;
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
      userHasAuthenticated(true);
      history.push("/portal");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit} className="max-width-form">
        <div className="centered-content">
          <p>A confirmation code has been sent to your email inbox and should arrive within 1 minute.</p>
        </div>
        <table className="form-table">
          <tbody>
            <tr className="form-field-with-note">
              <td className="form-label">Confirmation Code</td>
              <td className="form-field">
                <FormControl
                  autoFocus
                  type="tel"
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  value={confirmationCode}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <HelpBlock className="no-margin-bottom">Enter the code that was emailed to you.</HelpBlock>
              </td>
            </tr>
          </tbody>
        </table>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Submit
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
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
              <td className="form-label">Email</td>
              <td className="form-field">
                <FormControl
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            <tr className="form-field-with-note">
              <td className="form-label">Password</td>
              <td className="form-field">
                <FormControl
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <HelpBlock className="no-margin-bottom">
                  Password must contain all of the following:<br />
                  - at least 8 characters<br />
                  - at least 1 number<br />
                  - at least 1 special character<br />
                  - at least 1 uppercase letter<br />
                  - at least 1 lowercase letter<br />
                </HelpBlock>
              </td>
            </tr>
            <tr>
              <td className="form-label">Confirm Password</td>
              <td className="form-field">
                <FormControl
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
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
          Create Account
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="container Signup">
      <PageHeader>Create an Account</PageHeader>
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
