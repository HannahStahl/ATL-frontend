import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function TennisCenters() {
  const { locations } = useAppContext();
  return (
    <div className="container">
      <PageHeader>Local Tennis Centers</PageHeader>
      <div className="centered-content">
        <p className="tennis-centers-intro">
          To view a map of all tennis centers in Austin, go to <a href="https://tennismaps.com/Index.asp?regionid=1&paramquery=tennis+centers">Tennis Maps</a>.
        </p>
      </div>
      <div className="centered-content">
        <ul>
          {locations.filter((location) => location.locationType === "Center").map((location) => {
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
      </div>
    </div>
  );
}
