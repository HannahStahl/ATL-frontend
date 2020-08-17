import React from "react";
import { PageHeader, Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function TeamListing() {
  const { allTeams, divisions, allCaptains } = useAppContext();
  return (
    <div className="container">
      <PageHeader>Team Listing</PageHeader>
      <div className="centered-content">
        {allTeams.length > 0 ? (
          <div className="table-container">
            <Table bordered hover className="interactive-table">
              <thead>
                <tr>
                  <th>Division</th>
                  <th>Team Name</th>
                  <th>Captain</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map((division) => (
                  allTeams.filter((team) => team.divisionId === division.divisionId).map((team) => {
                    const captain = allCaptains.find((captain) => captain.userId === team.captainId);
                    return (
                      <tr key={team.teamId} onClick={() => window.location.pathname = `/roster/${team.teamId}`}>
                        <td>{division.divisionNumber}</td>
                        <td>{team.teamName}</td>
                        <td>{captain ? `${captain.firstName || ''} ${captain.lastName || ''}` : ''}</td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </Table>
          </div>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}
