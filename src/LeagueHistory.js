import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

export default function LeagueHistory() {
  return (
    <div className="container">
      <PageHeader>League History</PageHeader>
      {content.history.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
  );
}
