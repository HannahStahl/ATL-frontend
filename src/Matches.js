import React from "react";
import moment from "moment";
import { PageHeader } from "react-bootstrap";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { allMatches, locations, allTeams, team, loadingData } = useAppContext();

  const columns = {
    weekNumber: { label: "Week" },
    matchDate: { label: "Date", type: "date", render: (value) => value && moment(value).format("M/D/YYYY") },
    startTime: { label: "Time" },
    locationId: {
      label: "Location",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
    },
    homeTeamId: {
      label: "Home Team",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    },
    visitorTeamId: {
      label: "Visiting Team",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    }, // TODO change these to Home boolean and Opponent name
    singles1Score: { label: "S1 Score" },
    singles2Score: { label: "S2 Score" },
    doubles1Score: { label: "D1 Score" },
    doubles2Score: { label: "D2 Score" },
    totalHomeSetsWon: { label: "Home Sets Won" },
    totalVisitorSetsWon: { label: "Visitor Sets Won" }
  };

  const { teamId } = team;

  const filterMatches = (list) => list.filter(
    (match) => match.homeTeamId === teamId || match.visitorTeamId === teamId
  );

  return (
    <div className="container">
      <PageHeader>Match Schedule</PageHeader>
      {!loadingData && (
        teamId ? (
          <Table
            columns={columns}
            rows={allMatches}
            filterRows={filterMatches}
            itemType="match"
          />
        ) : (
          <p className="link-below-button">
            Head over to the <a href="/team-details">Team Details</a> page to create your team, then you will be able to view your match schedule.
          </p>
        )
      )}
    </div>
  );
}
