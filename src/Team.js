import React, { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";
import Roster from "./Roster";
import Matches from "./Matches";

export default function Team() {
  const { loadingData, profile, allTeams, allCaptains, locations, divisions } = useAppContext();
  const { userId } = profile;
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [team, setTeam] = useState({});
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchTeam() {
      const captainTeams = allTeams.filter((teamInList) => (
        teamInList.captainId === userId || teamInList.cocaptainId === userId
      ));
      setTeams(captainTeams);
      const captainTeam = captainTeams[0];
      setTeam(captainTeam || {});
      setLoadingTeam(false);
    }
    fetchTeam();
  }, [userId, allTeams]);

  const getCaptain = () => {
    const captain = team.captainId && team.captainId.length > 0 ? (
      allCaptains.find((captainInList) => captainInList.userId === team.captainId)
    ) : "";
    return captain ? (
      <>
        {`${captain.firstName} ${captain.lastName}`}
        <br />
        {captain.email}
        <br />
        {captain.phone}
      </>
    ) : "";
  };

  const getCocaptain = () => {
    const cocaptain = team.cocaptainId && team.cocaptainId.length > 0 ? (
      allCaptains.find((captainInList) => captainInList.userId === team.cocaptainId)
    ) : "";
    return cocaptain ? (
      <>
        {`${cocaptain.firstName} ${cocaptain.lastName}`}
        <br />
        {cocaptain.email}
        <br />
        {cocaptain.phone}
      </>
    ) : "";
  };

  const getDivision = () => {
    const division = team.divisionId && team.divisionId.length > 0 ? (
      divisions.find((divisionInList) => divisionInList.divisionId === team.divisionId)
    ) : "";
    return division ? (division.divisionNumber || "") : "";
  };

  const getLocation = () => {
    const location = team.locationId && team.locationId.length > 0 ? (
      locations.find((locationInList) => locationInList.locationId === team.locationId)
    ) : "";
    return location ? (location.locationName || "") : "";
  };

  return (
    <div className="container">
      <div className="team-details">
        <h1 className="team-details-page-header">Team Details</h1>
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
        {!loadingData && !loadingTeam && (
          <div className="centered-content">
            <table className="team-details-table">
              <tbody>
                <tr>
                  <td>
                    <p><b>Team Name:</b></p>
                  </td>
                  <td>
                    <p>{team.teamName || ""}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p><b>Captain:</b></p>
                  </td>
                  <td>
                    <p>{getCaptain()}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p><b>Co-Captain:</b></p>
                  </td>
                  <td>
                    <p>{getCocaptain()}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p><b>Division:</b></p>
                  </td>
                  <td>
                    <p>{getDivision()}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p><b>Home Courts:</b></p>
                  </td>
                  <td>
                    <p>{getLocation()}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Roster team={team} />
      <Matches team={team} />
    </div>
  );
}
