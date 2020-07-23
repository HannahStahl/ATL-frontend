import React, { useState } from "react";
import { PageHeader, FormControl, Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function Standings() {
  const { divisions, allTeams, standings, allMatches } = useAppContext();
  const [divisionId, setDivisionId] = useState("");

  const getSets = (teamId, weekNumber) => {
    const match = allMatches.find((matchInList) => (
      (matchInList.homeTeamId === teamId || matchInList.visitorTeamId === teamId) &&
      parseInt(matchInList.weekNumber) === parseInt(weekNumber)
    ));
    return {
      setsWon: match ? (match.homeTeamId === teamId ? match.totalHomeSetsWon : match.totalVisitorSetsWon) : "",
      setsLost: match ? (match.homeTeamId === teamId ? match.totalVisitorSetsWon : match.totalHomeSetsWon) : ""
    };
  };

  const renderWL = (teamId, weekNumber) => {
    const { setsWon, setsLost } = getSets(teamId, weekNumber);
    return (
      <React.Fragment key={weekNumber}>
        <td>{setsWon}</td>
        <td>{setsLost}</td>
      </React.Fragment>
    )
  };

  return (
    <div className="container">
      <PageHeader>Standings</PageHeader>
      {divisions.length > 0 && allTeams.length > 0 && standings.length > 0 && allMatches.length > 0 && (
        <div className="centered-content">
          <div className="centered-content-inner">
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
            <div className="table-container">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Sets Won</th>
                    <th>Sets Lost</th>
                    <th>Total Sets</th>
                    <th>%</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((weekNumber) => (
                      <th key={weekNumber} colSpan={2}>Week {weekNumber}</th>
                    ))}
                  </tr>
                  <tr>
                    <th />
                    <th />
                    <th />
                    <th />
                    <th />
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((weekNumber) => (
                      <React.Fragment key={weekNumber}>
                        <th>W</th>
                        <th>L</th>
                      </React.Fragment>
                    ))}
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
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((weekNumber) => renderWL(team.teamId, weekNumber))}
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
