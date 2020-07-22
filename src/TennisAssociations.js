import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function TennisAssociations() {
  const { associations } = useAppContext();
  return (
    <div className="container">
      <PageHeader>Tennis Associations</PageHeader>
      <ul>
        {associations.map((association) => {
          const { websiteUrl, associationName, associationId } = association;
          return (
            <li key={associationId}>
              {websiteUrl
                ? <a href={websiteUrl.startsWith('http') ? websiteUrl : `http://${websiteUrl}`}>{associationName}</a>
                : associationName}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
