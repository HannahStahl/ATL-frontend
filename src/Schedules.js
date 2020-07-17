import React, { useState, useEffect } from "react";
import { PageHeader, FormGroup, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default () => {
  const { matches, setMatches, locations, allTeams } = useAppContext();
  const [location, setLocation] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

  const playerColumn = (label, home) => ({
    label,
    type: "dropdown",
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
    weekNumber: { label: "Week", type: "number", required: true },
    startTime: { label: "Start Time", type: "text" },
    locationId: {
      label: "Location",
      type: "dropdown",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
    },
    homeTeamId: {
      label: "Home Team",
      type: "dropdown",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
      required: true,
    },
    visitorTeamId: {
      label: "Visiting Team",
      type: "dropdown",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
      required: true
    },
    singles1HomePlayerId: playerColumn("S1 Home Player", true),
    singles1VisitorPlayerId: playerColumn("S1 Visitor Player", false),
    singles2HomePlayerId: playerColumn("S2 Home Player", true),
    singles2VisitorPlayerId: playerColumn("S2 Visitor Player", false),
    doubles1HomePlayers: doublesColumn("D1 Home Players", true, [
      { key: "doubles1HomePlayer1Id", label: "D1 Home Players" },
      { key: "doubles1HomePlayer2Id" }
    ]),
    doubles1VisitorPlayers: doublesColumn("D1 Visitor Players", false, [
      { key: "doubles1VisitorPlayer1Id", label: "D1 Visitor Players" },
      { key: "doubles1VisitorPlayer2Id" }
    ]),
    doubles2HomePlayers: doublesColumn("D2 Home Players", true, [
      { key: "doubles2HomePlayer1Id", label: "D2 Home Players" },
      { key: "doubles2HomePlayer2Id" }
    ]),
    doubles2VisitorPlayers: doublesColumn("D2 Visitor Players", false, [
      { key: "doubles2VisitorPlayer1Id", label: "D2 Visitor Players" },
      { key: "doubles2VisitorPlayer2Id" }
    ]),
    singles1Score: { label: "S1 Score", type: "text" },
    singles2Score: { label: "S2 Score", type: "text" },
    doubles1Score: { label: "D1 Score", type: "text" },
    doubles2Score: { label: "D2 Score", type: "text" },
    singles1HomeSetsWon: { label: "S1 Home Sets Won", type: "number", hideFromTable: true },
    singles1VisitorSetsWon: { label: "S1 Visitor Sets Won", type: "number", hideFromTable: true },
    singles2HomeSetsWon: { label: "S2 Home Sets Won", type: "number", hideFromTable: true },
    singles2VisitorSetsWon: { label: "S2 Visitor Sets Won", type: "number", hideFromTable: true },
    doubles1HomeSetsWon: { label: "D1 Home Sets Won", type: "number", hideFromTable: true },
    doubles1VisitorSetsWon: { label: "D1 Visitor Sets Won", type: "number", hideFromTable: true },
    doubles2HomeSetsWon: { label: "D2 Home Sets Won", type: "number", hideFromTable: true },
    doubles2VisitorSetsWon: { label: "D2 Visitor Sets Won", type: "number", hideFromTable: true },
    totalHomeSetsWon: { label: "Home Sets Won", type: "number", readOnly: true },
    totalVisitorSetsWon: { label: "Visitor Sets Won", type: "number", readOnly: true }
  };

  const filterMatches = (list) => location.locationId ? list.filter((match) => match.locationId === location.locationId) : [];

  const validate = (body) => {
    const { homeTeamId, visitorTeamId } = body;
    if (homeTeamId === visitorTeamId) {
      onError("Home team and visiting team must be different.");
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <PageHeader>Match Schedules</PageHeader>
      <form>
        <FormGroup controlId="locationId">
          <FormControl
            value={location.locationId || ''}
            componentClass="select"
            onChange={e => setLocation(locations.find((locationInList) => locationInList.locationId === e.target.value))}
          >
            <option value="" disabled>Select location</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>{location.locationName}</option>
            ))}
          </FormControl>
        </FormGroup>
      </form>
      {location.locationId && (
        <Table
          columns={columns}
          rows={matches}
          filterRows={filterMatches}
          setRows={setMatches}
          getRows={() => API.get("atl-backend", "list/match")}
          itemType="match"
          API={API}
          validate={validate}
        />
      )}
    </div>
  );
}
