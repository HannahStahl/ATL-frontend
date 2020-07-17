import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

export default function GeneralInfo() {
  return (
    <div className="container">
      <PageHeader>League Information</PageHeader>
      <p>
        Each team fields two singles and two doubles matches each Saturday (6 players).
        A team typically consists of 10 to 17 players, insuring that a full team will be fielded for each match.
        Matches are played at the public tennis centers, clubs and school courts.
      </p>
      <div className="centered-content committee-members">
        <div>
          <h3>Committee Members:</h3>
          {content.committee.map((member) => <p key={member} className="committee-member">{member}</p>)}
        </div>
      </div>
    </div>
  );
}
