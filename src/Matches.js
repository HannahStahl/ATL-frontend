import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { matches, locations, allTeams, team, loadingData } = useAppContext();
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

  const playerColumn = (label, home) => ({
    label,
    joiningTable: allPlayers,
    joiningTableFilter: {
      key: home ? "homeTeamId" : "visitorTeamId",
      joiningTableKey: "teamId"
    },
    joiningTableKey: "playerId",
    joiningTableFieldNames: ["firstName", "lastName"]
  });

  const doublesColumn = (label, home, children) => ({
    label,
    children: children.map((child) => ({ key: child.key, ...playerColumn(child.label, home) })),
    childrenJoiner: ', '
  });

  const columns = {
    weekNumber: { label: "Week" },
    startTime: { label: "Start Time" },
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
            rows={matches}
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
