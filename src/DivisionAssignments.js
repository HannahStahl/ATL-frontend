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
          {content.problems[section].map((item) => (
            <>
              <p key={item.item} dangerouslySetInnerHTML={{ __html: item }} />
              {item.children.length > 0 && (
                <ol>
                  {item.children.map((childItem) => (
                    <li key={childItem} dangerouslySetInnerHTML={{ __html: childItem }} />
                  ))}
                </ol>
              )}
            </>
          ))}
        </div>
      ))}
    </div>
  );
}
