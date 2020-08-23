import React from "react";
import { PageHeader, Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export const getOrderedTeamsInDivision = (allTeams, standings, divisionId) => {
  const teamsInDivision = allTeams.filter((team) => team.isActive && team.divisionId === divisionId);
  const sortedTeams = teamsInDivision.sort((a, b) => {
    const team1 = standings.find((standing) => standing.teamId === a.teamId);
    const team2 =  standings.find((standing) => standing.teamId === b.teamId);
    if (team1 && !team2) return -1;
    if (team2 && !team1) return 1;
    if (team1 && team2 && team1.percentSetsWon > team2.percentSetsWon) return -1;
    if (team1 && team2 && team2.percentSetsWon > team1.percentSetsWon) return 1;
    return 0;
  });
  return sortedTeams.map((team) => team.teamName);
};

export default function LeaderBoard() {
  const { divisions, allTeams, standings } = useAppContext();

  return (
    <div className="container">
      <PageHeader>Leader Board</PageHeader>
      {divisions.length > 0 && allTeams.length > 0 && standings.length > 0 ? (
        <div className="centered-content">
          <div className="table-container">
            <Table bordered>
              <thead>
                <tr>
                  <th>Division</th>
                  <th>1st</th>
                  <th>2nd</th>
                  <th>3rd</th>
                  <th>4th</th>
                  <th>5th</th>
                  <th>6th</th>
                </tr>
              </thead>
              <tbody>
                {divisions.map((division) => {
                  const teams = getOrderedTeamsInDivision(allTeams, standings, division.divisionId);
                  return (
                    <tr key={division.divisionId}>
                      <td>{division.divisionNumber}</td>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <td key={index}>{teams[index]}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      ) : <p className="centered-text">Loading...</p>}
    </div>
  );
}
