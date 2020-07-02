import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "../libs/contextLib";

export default () => {
  const { matches, setMatches, locations, allPlayers, allTeams, team } = useAppContext();

  const playerColumn = (label) => ({
    label: label,
    type: "dropdown",
    joiningTable: "players",
    joiningTableKey: "playerId",
    joiningTableFieldNames: ["firstName", "lastName"]
  });

  const columns = {
    weekNumber: { label: "Week", type: "number", required: true },
    startTime: { label: "Start Time", type: "text" },
    locationId: {
      label: "Location",
      type: "dropdown",
      joiningTable: "locations",
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
    },
    homeTeamId: {
      label: "Home Team",
      type: "dropdown",
      joiningTable: "teams",
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    },
    visitorTeamId: {
      label: "Visiting Team",
      type: "dropdown",
      joiningTable: "teams",
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    }, // TODO change these to Home boolean and Opponent name
    singles1HomePlayerId: playerColumn("Home S1"),
    singles1VisitorPlayerId: playerColumn("Visitor S1"),
    singles2HomePlayerId: playerColumn("Home S2"),
    singles2VisitorPlayerId: playerColumn("Visitor S2"),
    doubles1HomePlayer1Id: playerColumn("Home D1 1"),
    doubles1HomePlayer2Id: playerColumn("Home D1 2"), // TODO combine with above
    doubles1VisitorPlayer1Id: playerColumn("Visitor D1 1"),
    doubles1VisitorPlayer2Id: playerColumn("Visitor D1 2"), // TODO combine with above
    doubles2HomePlayer1Id: playerColumn("Home D2 1"),
    doubles2HomePlayer2Id: playerColumn("Home D2 2"), // TODO combine with above
    doubles2VisitorPlayer1Id: playerColumn("Visitor D2 1"),
    doubles2VisitorPlayer2Id: playerColumn("Visitor D2 2"), // TODO combine with above
    singles1Score: { label: "S1 Score", type: "text" }, // TODO instead of text input, have separate number inputs for set scores, then remove individual sets won fields
    singles2Score: { label: "S2 Score", type: "text" },
    doubles1Score: { label: "D1 Score", type: "text" },
    doubles2Score: { label: "D2 Score", type: "text" },
    singles1HomeSetsWon: { label: "Home S1 Sets Won", type: "number" },
    singles1VisitorSetsWon: { label: "Visitor S1 Sets Won", type: "number" },
    singles2HomeSetsWon: { label: "Home S2 Sets Won", type: "number" },
    singles2VisitorSetsWon: { label: "Visitor S2 Sets Won", type: "number" },
    doubles1HomeSetsWon: { label: "Home D1 Sets Won", type: "number" },
    doubles1VisitorSetsWon: { label: "Visitor D1 Sets Won", type: "number" },
    doubles2HomeSetsWon: { label: "Home D2 Sets Won", type: "number" },
    doubles2VisitorSetsWon: { label: "Visitor D2 Sets Won", type: "number" },
    totalHomeSetsWon: { label: "Home Total Sets Won", type: "number" }, // TODO instead of allowing users to edit these fields directly, auto-update them on edit of one of the above 4 fields
    totalVisitorSetsWon: { label: "Visitor Total Sets Won", type: "number" }
  };

  const { teamId } = team;
  const matchesForTeam = teamId
    ? matches.filter((match) => match.homeTeamId === teamId || match.visitorTeamId === teamId)
    : [];

  return (
    <div>
      <PageHeader>Match Schedule</PageHeader>
      {matchesForTeam.length > 0 && (
        <Table
          columns={columns}
          rows={matchesForTeam}
          setRows={setMatches}
          itemType="match"
          joiningTables={{ locations, players: allPlayers, teams: allTeams }}
          API={API}
        />
      )}
    </div>
  );
}
