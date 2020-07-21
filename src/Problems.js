import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

export default function Problems() {
  return (
    <div className="container">
      <PageHeader>Knotty Problems</PageHeader>
      {Object.keys(content.problems).map((section) => (
        <div key={section}>
          <h3>{section}</h3>
          <ol>
            {content.problems[section].map((item) => (
              <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
