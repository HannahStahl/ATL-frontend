import React from "react";
import { PageHeader } from "react-bootstrap";
import content from "./content.json";

export default function DivisionAssignments() {
  return (
    <div className="container">
      <PageHeader>How the ATL Committee Places Teams in Divisions</PageHeader>
      {Object.keys(content.divisionAssignments).map((section) => (
        <div key={section}>
          <h3>{section}</h3>
          {content.divisionAssignments[section].map((item) => (
            <React.Fragment key={item.text}>
              <p dangerouslySetInnerHTML={{ __html: item.text }} />
              {item.children.length > 0 && (
                <ol>
                  {item.children.map((childItem) => (
                    <li key={childItem} dangerouslySetInnerHTML={{ __html: childItem }} />
                  ))}
                </ol>
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
