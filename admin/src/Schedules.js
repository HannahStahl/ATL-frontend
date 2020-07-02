import React, { useState } from "react";
import { PageHeader, FormGroup, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { matches, locations, teams } = useAppContext();
  const [location, setLocation] = useState({});

  const columns = {
    weekNumber: { label: "Week" },
    "startTime": { label: "Start Time" },
    homeTeamId: {
      label: "Home Team",
      joiningTable: "teams",
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    },
    visitorTeamId: {
      label: "Visiting Team",
      joiningTable: "teams",
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    },
  };

  const matchesForLocation = location.locationId ? matches.filter((match) => match.locationId === location.locationId) : [];

  return (
    <div>
      <PageHeader>Match Schedules</PageHeader>
      <form>
        <FormGroup controlId="locationId">
          <FormControl
            value={location.locationId || ''}
            componentClass="select"
            onChange={e => setLocation({ ...location, locationId: e.target.value })}
          >
            <option value="" disabled>Select location</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>{location.locationName}</option>
            ))}
          </FormControl>
        </FormGroup>
      </form>
      {matchesForLocation.length > 0 && (
        <Table columns={columns} rows={matchesForLocation} itemType="match" joiningTables={{ teams }} API={API} />
      )}
    </div>
  );
}
