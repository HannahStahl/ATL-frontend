import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const {
    allTeams, setAllTeams, allCaptains, divisions, locations, loadingData,
  } = useAppContext();

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
    <div className="container">
      <PageHeader>Teams</PageHeader>
      {!loadingData && (
        <Table
          columns={columns}
          rows={allTeams}
          setRows={setAllTeams}
          getRows={() => API.get("atl-backend", "list/team")}
          itemType="team"
          API={API}
        />
      )}
    </div>
  );
}
