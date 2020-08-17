import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function TennisClubs() {
  const { locations } = useAppContext();
  return (
    <div className="container">
      <PageHeader>Local Tennis Clubs</PageHeader>
      <div className="centered-content">
        {locations.length > 0 ? (
          <ul>
            {locations.filter((location) => location.locationType === "Club").map((location) => {
              const { tennisMapsUrl, locationName, locationId } = location;
              return (
                <li key={locationId}>
                  <p>
                    {tennisMapsUrl
                      ? <a href={tennisMapsUrl.startsWith('http') ? tennisMapsUrl : `http://${tennisMapsUrl}`}>{locationName}</a>
                      : locationName
                    }
                  </p>
                </li>
              );
            })}
          </ul>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}
