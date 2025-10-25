import React, { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Roster from "./Roster";
import Matches from "./Matches";
import EditForm from "./EditForm";
import Division from "./Division";
import LoaderButton from "./LoaderButton";
import RegisterTeamModal from "./RegisterTeamModal";

export default function Team() {
  const {
    loadingData, profile, allTeams, setAllTeams, allCaptains, locations, divisions, users, seasons
  } = useAppContext();
  const { isAdmin } = profile;
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [team, setTeam] = useState({});
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState({});
  const [selectedUser, setSelectedUser] = useState(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  
  useEffect(() => {
    setSelectedUser(profile);
  }, [profile]);

  useEffect(() => {
    async function fetchTeamAndSeason() {
      const captainTeams = allTeams.filter((teamInList) => (
        teamInList.isActive && (
          teamInList.captainId === selectedUser.userId ||
          teamInList.cocaptainId === selectedUser.userId
        )
      ));
      setTeams(captainTeams);
      const captainTeam = captainTeams[0];
      setTeam(captainTeam || {});
      setLoadingTeam(false);
      const currentSeason = seasons.find((season) => season.currentSeason);
      setSeason(currentSeason);
    }
    if (!loadingData) fetchTeamAndSeason();
  }, [loadingData, selectedUser, allTeams, seasons]);

  const formFields = {
    divisionId: {
      label: "Division",
      type: "dropdown",
      joiningTable: divisions,
      joiningTableKey: "divisionId",
      joiningTableFieldNames: ["divisionNumber"],
      staticField: true,
    },
    teamName: { label: "Team Name", type: "text", required: true },
    captainId: {
      label: "Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"],
      extraNotes: (team) => {
        if (team.captainId && team.captainId.length > 0) {
          const captain = allCaptains.find((captain) => captain.userId === team.captainId);
          return <span>{captain.email}<br />{captain.phone}</span>;
        }
        return "";
      },
    },
    cocaptainId: {
      label: "Co-Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"],
      extraNotes: (team) => {
        if (team.cocaptainId && team.cocaptainId.length > 0) {
          const cocaptain = allCaptains.find((captain) => captain.userId === team.cocaptainId);
          return <span>{cocaptain.email}<br />{cocaptain.phone}</span>;
        }
        return "";
      },
    },
    locationId: {
      label: "Home Courts",
      type: "dropdown",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
    },
    courtTime: { label: "Preferred Start Time", type: "text" }
  };

  const emailCaptain = async (captainId, teamName, url, captainOrCocaptain) => {
    const captain = allCaptains.find((captainInList) => captainInList.userId === captainId);
    const { firstName, email: captainEmail } = captain;
    await API.post("atl-backend", "emailCaptain", {
      body: { firstName, teamName, captainOrCocaptain, url, captainEmail }
    });
  };

  const saveTeamDetails = async (event, body) => {
    event.preventDefault();
    const { teamId, captainId, cocaptainId, teamName } = body;
    if (profile.userId !== captainId && profile.userId !== cocaptainId) {
      onError("You must be either the captain or the co-captain of this team.");
      return;
    }
    setIsSaving(true);
    const original = await API.get("atl-backend", `get/team/${teamId}`);
    await API.put("atl-backend", `update/team/${teamId}`, { body });
    const updatedTeams = await API.get("atl-backend", "list/team");
    const url = window.location.origin;
    const promises = [];
    if (captainId && captainId.length > 0 && captainId !== original.captainId) {
      promises.push(emailCaptain(captainId, teamName, url, "captain"));
    }
    if (cocaptainId && cocaptainId.length > 0 && cocaptainId !== original.cocaptainId) {
      promises.push(emailCaptain(cocaptainId, teamName, url, "co-captain"));
    }
    await Promise.all(promises);
    setAllTeams([...updatedTeams]);
    setIsSaving(false);
  };

  return (
    <div className="container">
      <div className="team-details">
        <h1 className="team-details-page-header">Team Details</h1>
        {isAdmin && (
          <>
            <table>
              <tbody>
                <tr>
                  <td className="form-label">Viewing team info for:</td>
                  <td className="form-field">
                    <FormControl
                      value={selectedUser.userId || ""}
                      componentClass="select"
                      onChange={e => setSelectedUser(users.find((user) => user.userId === e.target.value))}
                    >
                      {users.map((user) => (
                        <option key={user.userId} value={user.userId}>
                          {`${user.firstName || ""} ${user.lastName || ""}`}
                        </option>
                      ))}
                    </FormControl>

                  </td>
                </tr>
              </tbody>
            </table>
            <hr className="team-details-page-break" />
          </>
        )}
        {teams.length > 1 && (
          <>
            <table>
              <tbody>
                <tr>
                  <td className="form-label">Select team to view:</td>
                  <td className="form-field">
                    <FormControl
                      value={(team.teamId) || ""}
                      componentClass="select"
                      onChange={e => setTeam(teams.find((teamInList) => teamInList.teamId === e.target.value))}
                    >
                      {teams.map((teamInList) => (
                        <option key={teamInList.teamId} value={teamInList.teamId}>{teamInList.teamName}</option>
                      ))}
                    </FormControl>

                  </td>
                </tr>
              </tbody>
            </table>
            <hr className="team-details-page-break" />
          </>
        )}
        {!loadingTeam && team.teamId && !team.isRegistered && (
          <div className="centered-content">
            <div className="centered-content-inner">
              <div className="team-registration">
                <p className="centered-text">
                  <b>You must register your team for the upcoming Austin Tennis League season.</b>
                </p>
                <LoaderButton
                  block
                  bsSize="large"
                  bsStyle="primary"
                  onClick={() => setRegistrationModalVisible(true)}
                >
                  Continue
                </LoaderButton>
              </div>
              <hr className="team-details-page-break" />
            </div>
          </div>
        )}
        <div className="centered-content"> 
          {loadingTeam ? <p>Loading...</p> : (
            team.teamId ? (
              <EditForm
                fields={formFields}
                original={team}
                save={saveTeamDetails}
                isLoading={isSaving}
              />
            ) : (
              selectedUser.isCaptain ? (
                <p className="centered-text">
                  Leon is working on associating you with your team(s).
                  You will receive an email when this process is complete.
                </p>
              ) : (
                <p className="centered-text">
                  You are not the captain of any teams.
                </p>
              )
            )
          )}
        </div>
      </div>
      {!loadingTeam && <Roster team={team} />}
      {!loadingTeam && <Matches team={team} />}
      {!loadingTeam && <Division team={team} />}
      <RegisterTeamModal
        registrationModalVisible={registrationModalVisible}
        setRegistrationModalVisible={setRegistrationModalVisible}
        seasonName={season.seasonName}
        team={team}
      />
    </div>
  );
}
