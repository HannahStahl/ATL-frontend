import React from "react";
import moment from "moment";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default ({ team }) => {
  const { allMatches, setAllMatches, locations, allTeams, loadingData } = useAppContext();

  const columns = {
    weekNumber: { label: "Week", readOnly: true },
    matchDate: {
      label: "Date",
      type: "date",
      readOnly: true,
      render: (value) => value && moment(value).format("M/D/YYYY")
    },
    startTime: { label: "Time", readOnly: true },
    locationId: {
      label: "Location",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"],
      readOnly: true
    },
    homeTeamId: {
      label: "Home Team",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
      readOnly: true
    },
    visitorTeamId: {
      label: "Visiting Team",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
      readOnly: true
    }, // TODO change these to Home boolean and Opponent name
    singles1Score: { label: "S1 Score", type: "text" },
    singles2Score: { label: "S2 Score", type: "text" },
    doubles1Score: { label: "D1 Score", type: "text" },
    doubles2Score: { label: "D2 Score", type: "text" }
  };

  const { teamId } = team;

  const filterMatches = (list) => list.filter(
    (match) => match.homeTeamId === teamId || match.visitorTeamId === teamId
  );

  return !loadingData && teamId ? (
    <>
      <hr className="team-details-page-break" />
      <h1 className="team-details-page-header">Matches</h1>
      <Table
        columns={columns}
        rows={allMatches}
        filterRows={filterMatches}
        setRows={setAllMatches}
        getRows={() => API.get("atl-backend", "list/match")}
        itemType="match"
        API={API}
        createDisabled
        removeDisabled
      />
    </>
  ) : <div />;
}
