import React, { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import EditForm from "./EditForm";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Roster from "./Roster";
import Matches from "./Matches";

export default function Team() {
  const { loadingData, profile, allTeams, allCaptains, locations, divisions } = useAppContext();
  const { userId } = profile;
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState({});
  const [teams, setTeams] = useState([]);
  const { teamId } = team;

  useEffect(() => {
    async function fetchTeam() {
      const captainTeams = allTeams.filter((teamInList) => (
        teamInList.captainId === userId || teamInList.cocaptainId === userId
      ));
      setTeams(captainTeams);
      const captainTeam = captainTeams[0];
      setTeam(captainTeam || {});
    }
    fetchTeam();
  }, [userId, allTeams]);

  const saveTeam = async (event, body) => {
    event.preventDefault();
    if (body.captainId === body.cocaptainId) {
      onError("Captain and co-captain cannot be the same.");
    } else if (body.captainId !== userId && body.cocaptainId !== userId) {
      onError("You must be either the captain or co-captain of this team.");
    } else {
      setIsLoading(true);
      if (teamId) {
        const result = await API.put("atl-backend", `update/team/${teamId}`, { body });
        setTeam(result);
      }
      else {
        const result = await API.post("atl-backend", "create/team", { body });
        setTeam(result);
      }
      setIsLoading(false);
    }
  };

  const columns = {
    teamName: { label: "Team Name", type: "text", required: true },
    captainId: {
      label: "Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"]
    },
    cocaptainId: {
      label: "Co-Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"]
    },
    divisionId: {
      label: "Division",
      type: "dropdown",
      joiningTable: divisions,
      joiningTableKey: "divisionId",
      joiningTableFieldNames: ["divisionNumber"]
    },
    locationId: {
      label: "Home Courts",
      type: "dropdown",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
    }
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
        {!loadingData && (
          <EditForm
            fields={columns}
            original={team}
            save={saveTeam}
            isLoading={isLoading}
          />
        )}
      </div>
      <Roster team={team} />
      <Matches team={team} />
    </div>
  );
}
