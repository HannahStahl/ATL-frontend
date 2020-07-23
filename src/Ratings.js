import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

export default function Ratings() {
  return (
    <div className="container">
      <PageHeader>NTRP Self-Rating Guidelines</PageHeader>
      <div className="centered-content">
        <div>
          <ol>
            {content.selfRatingInstructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ol>
          <hr />
          <p>The rating categories are generalizations about skill levels.</p>
          <ul>
            {content.selfRatingInfo.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <hr />
          {content.ntrpRatings.map((level) => (
            <div key={level.header}>
              <h3>{level.header}:</h3>
              {level.text.map((line) => <p key={line} className="self-rating-info">{line}</p>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
