import React, { useState } from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

const renderAddress = (location) => (
  <>
    {(location.address || location.city || location.zip) && ': '}
    {location.address || ''}
    {(location.address && (location.city || location.zip)) ? ', ' : ''}
    {location.city ? `${location.city}, TX` : ''}
    {location.zip && ` ${location.zip}`}
  </>
);

const CourtLocation = (location) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <li>
      <img
        src={expanded ? 'minus-circle.png' : 'plus-circle.png'}
        alt={expanded ? 'Hide Directions' : 'Show Directions'}
        onClick={() => setExpanded(!expanded)}
        className="toggle-directions"
      />
      <div>
        {location.tennisMapsUrl
          ? (
            <p className={location.directions && expanded ? 'no-margin-bottom' : undefined}>
              <b><a href={location.tennisMapsUrl}>{location.locationName}</a></b>
              {renderAddress(location)}
            </p>
          ) : (
            <p className={location.directions && expanded ? 'no-margin-bottom' : undefined}>
              <b>{location.locationName}</b>
              {renderAddress(location)}
            </p>
          )
        }
        {location.directions && expanded && <p className="directions">{location.directions}</p>}
      </div>
    </li>
  )
};

export default function CourtLocations() {
  const { locations } = useAppContext();
  return (
    <div className="container">
      <PageHeader>Court Locations</PageHeader>
      <p className="court-locations-intro">
        Click on a location to view directions to it.
        If you have any questions regarding the directions, it is suggested that you check with the Home Captain before the day of the match.
        It is the responsibility of the Captain to inform players of court locations.
        Maps are available at: <a href="http://tennismaps.com">Tennis Maps</a>.
      </p>
      <ul className="court-locations-list">
        {locations.map((location) => <CourtLocation key={location.locationId} {...location} />)}
      </ul>
    </div>
  );
}
