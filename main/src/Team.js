import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader } from "react-bootstrap";
import { EditForm } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default function Team() {
  const { profile, team, setTeam, allCaptains, locations, divisions } = useAppContext();
  const { captainId } = profile;
  const [isLoading, setIsLoading] = useState(false);
  const { teamId } = team;

  const saveTeam = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    if (teamId) {
      const result = await API.put("atl-backend", `update/team/${teamId}`, { body });
      setTeam(result);
    }
    else {
      body.captainId = captainId;
      const result = await API.post("atl-backend", "create/team", { body });
      setTeam(result);
    }
    setIsLoading(false);
  };

  const columns = {
    teamName: { label: "Team Name", type: "text", required: true },
    captainId: {
      label: "Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "captainId",
      joiningTableFieldNames: ["firstName", "lastName"]
    },
    cocaptainId: {
      label: "Co-Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "captainId",
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
      label: "Location",
      type: "dropdown",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
    },
    courtNumber: { label: "Court Number", type: "number" },
    courtTime: { label: "Court Time", type: "text" },
    comments: { label: "Comments", type: "textarea" }
  };

  return (
    <div>
      <PageHeader>Team Details</PageHeader>
      <EditForm
        fields={columns}
        original={team}
        save={saveTeam}
        isLoading={isLoading}
      />
    </div>
  );
}
