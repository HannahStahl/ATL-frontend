import React, { useState } from "react";
import { API } from "aws-amplify";
import EditForm from "./EditForm";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Roster from "./Roster";
import Matches from "./Matches";
import Payment from "./Payment";

export default function Team() {
  const { profile, team, setTeam, allCaptains, locations, divisions } = useAppContext();
  const { userId } = profile;
  const [isLoading, setIsLoading] = useState(false);
  const { teamId } = team;

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
        <EditForm
          fields={columns}
          original={team}
          save={saveTeam}
          isLoading={isLoading}
        />
      </div>
      <Roster />
      <Matches />
      <Payment />
    </div>
  );
}
