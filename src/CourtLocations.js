import React, { useState } from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

const renderAddress = (location) => {
  const { address, city, zip } = location;
  return (
    <>
      {(address || city || zip) && ': '}
      {address || ''}
      {(address && (city || zip)) ? ', ' : ''}
      {city ? `${city}, TX` : ''}
      {zip && ` ${zip}`}
    </>
  );
};

const CourtLocation = (location) => {
  const [expanded, setExpanded] = useState(false);
  const { tennisMapsUrl, locationName, directions } = location;
  return (
    <li>
      <img
        src={expanded ? 'minus-circle.png' : 'plus-circle.png'}
        alt={expanded ? 'Hide Directions' : 'Show Directions'}
        onClick={() => setExpanded(!expanded)}
        className="toggle-directions"
      />
      <div>
        {tennisMapsUrl
          ? (
            <p className={directions && expanded ? 'no-margin-bottom' : undefined}>
              <b><a href={tennisMapsUrl.startsWith('http') ? tennisMapsUrl : `http://${tennisMapsUrl}`}>{locationName}</a></b>
              {renderAddress(location)}
            </p>
          ) : (
            <p className={directions && expanded ? 'no-margin-bottom' : undefined}>
              <b>{locationName}</b>
              {renderAddress(location)}
            </p>
          )
        }
        {directions && expanded && <p className="directions">{directions}</p>}
      </div>
    </li>
  )
};

export default function CourtLocations() {
  const { locations } = useAppContext();
  return (
    <div className="container">
      <PageHeader>Court Locations</PageHeader>
      {locations.length > 0 ? (
        <>
          <p className="court-locations-intro">
            Click on a location to view directions to it.
            If you have any questions regarding the directions, it is suggested that you check with the Home Captain before the day of the match.
            It is the responsibility of the Captain to inform players of court locations.
            Maps are available at: <a href="http://tennismaps.com">Tennis Maps</a>.
          </p>
          <ul className="court-locations-list">
            {locations.map((location) => <CourtLocation key={location.locationId} {...location} />)}
          </ul>
        </>
      ) : <p className="centered-content">Loading...</p>}
    </div>
  );
}
