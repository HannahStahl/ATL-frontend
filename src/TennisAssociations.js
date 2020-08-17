import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function TennisAssociations() {
  const { associations } = useAppContext();
  return (
    <div className="container">
      <PageHeader>Tennis Associations</PageHeader>
      <div className="centered-content">
        {associations.length > 0 ? (
          <ul>
            {associations.map((association) => {
              const { websiteUrl, associationName, associationId } = association;
              return (
                <li key={associationId}>
                  <p>
                    {websiteUrl
                      ? <a href={websiteUrl.startsWith('http') ? websiteUrl : `http://${websiteUrl}`}>{associationName}</a>
                      : associationName
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
