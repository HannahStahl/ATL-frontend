import React, { useState } from "react";
import { PageHeader, FormControl, Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function Standings() {
  const { divisions, allTeams, standings } = useAppContext();
  const [divisionId, setDivisionId] = useState("");

  return (
    <div className="container">
      <PageHeader>Standings</PageHeader>
      <div className="centered-content">
        <div>
          <FormControl
            className="standings-intro"
            value={divisionId}
            componentClass="select"
            onChange={e => setDivisionId(e.target.value)}
          >
            <option value="">All divisions</option>
            {divisions.map((division) => (
              <option key={division.divisionId} value={division.divisionId}>
                {`Division ${division.divisionNumber} only`}
              </option>
            ))}
          </FormControl>
          <Table bordered>
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Sets Won</th>
                <th>Sets Lost</th>
                <th>Total Sets</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {allTeams
                .filter((team) => divisionId === "" || team.divisionId === divisionId)
                .sort((a, b) => {
                  const team1 = standings.find((standing) => standing.teamId === a.teamId);
                  const team2 =  standings.find((standing) => standing.teamId === b.teamId);
                  if (a.divisionId < b.divisionId) return -1;
                  if (b.divisionId < a.divisionId) return 1;
                  if (team1 && !team2) return -1;
                  if (team2 && !team1) return 1;
                  if (team1 && team2 && team1.percentSetsWon > team2.percentSetsWon) return -1;
                  if (team1 && team2 && team2.percentSetsWon > team1.percentSetsWon) return 1;
                  return 0;
                }).map((team) => {
                  const teamStanding = standings.find((standing) => standing.teamId === team.teamId);
                  return (
                    <tr key={team.teamId}>
                      <td>{team.teamName}</td>
                      <td>{teamStanding && teamStanding.setsWon}</td>
                      <td>{teamStanding && teamStanding.setsLost}</td>
                      <td>{teamStanding && teamStanding.setsPlayed}</td>
                      <td>{teamStanding && (parseFloat(teamStanding.percentSetsWon || 0) * 100).toFixed(2)}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
