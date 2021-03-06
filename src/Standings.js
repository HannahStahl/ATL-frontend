import React, { useState, useEffect } from "react";
import { PageHeader, FormControl, Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function Standings() {
  const { divisions, allTeams, standings, allMatches, matchResults } = useAppContext();
  const [divisionId, setDivisionId] = useState("");

  useEffect(() => {
    const selectedDivisionId = window.location.search.split('?divisionId=')[1];
    if (selectedDivisionId) setDivisionId(selectedDivisionId);
  }, []);

  const getSets = (teamId, weekNumber) => {
    const match = allMatches.find((matchInList) => (
      (matchInList.homeTeamId === teamId || matchInList.visitorTeamId === teamId) &&
      parseInt(matchInList.weekNumber) === parseInt(weekNumber)
    ));
    const matchResult = match && matchResults.find((matchResult) => matchResult.matchId === match.matchId);
    return {
      setsWon: matchResult ? (match.homeTeamId === teamId ? matchResult.totalHomeSetsWon : matchResult.totalVisitorSetsWon) : "",
      setsLost: matchResult ? (match.homeTeamId === teamId ? matchResult.totalVisitorSetsWon : matchResult.totalHomeSetsWon) : ""
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

  const getDivisionNumber = (team) => {
    const division = divisions.find((division) => division.divisionId === team.divisionId);
    return division ? division.divisionNumber : "";
  };

  return (
    <div className="container">
      <PageHeader>Standings</PageHeader>
      {(
        divisions.length > 0 &&
        allTeams.length > 0 &&
        allMatches.length > 0
      ) ? (
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
                  {`Division ${division.divisionNumber}`}
                </option>
              ))}
            </FormControl>
            {standings.length > 0 ? (
              <div className="table-container">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Division</th>
                      <th>Team #</th>
                      <th>Team Name</th>
                      <th>Sets Won</th>
                      <th>Sets Lost</th>
                      <th>Total Sets</th>
                      <th>%</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((weekNumber) => (
                        <th key={weekNumber} colSpan={2}>Week {weekNumber}</th>
                      ))}
                      <th>Forf. Sets</th>
                    </tr>
                    <tr>
                      <th />
                      <th />
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
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {allTeams
                      .filter((team) => (
                        team.isActive &&
                        team.teamName !== "Bye" &&
                        (divisionId === "" || team.divisionId === divisionId)
                      ))
                      .sort((a, b) => {
                        const team1 = standings.find((standing) => standing.teamId === a.teamId);
                        const team2 =  standings.find((standing) => standing.teamId === b.teamId);
                        const aDivision = getDivisionNumber(a);
                        const bDivision = getDivisionNumber(b);
                        if (aDivision < bDivision) return -1;
                        if (bDivision < aDivision) return 1;
                        if (team1 && !team2) return -1;
                        if (team2 && !team1) return 1;
                        if (team1 && team2 && team1.percentSetsWon > team2.percentSetsWon) return -1;
                        if (team1 && team2 && team2.percentSetsWon > team1.percentSetsWon) return 1;
                        return 0;
                      }).map((team) => {
                        const teamStanding = standings.find((standing) => standing.teamId === team.teamId);
                        return (
                          <tr key={team.teamId}>
                            <td>{getDivisionNumber(team)}</td>
                            <td>{team.teamNumber || ""}</td>
                            <td>{team.teamName}</td>
                            <td>{teamStanding && teamStanding.setsWon}</td>
                            <td>{teamStanding && teamStanding.setsLost}</td>
                            <td>{teamStanding && teamStanding.setsPlayed}</td>
                            <td>{teamStanding && (parseFloat(teamStanding.percentSetsWon || 0) * 100).toFixed(2)}</td>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((weekNumber) => renderWL(team.teamId, weekNumber))}
                            <td>{teamStanding && teamStanding.setsForfeited}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </Table>
              </div>
            ) : (
              <p className="centered-text">No standings for this season yet.</p>
            )}
          </div>
        </div>
      ) : <p className="centered-text">Loading...</p>}
    </div>
  );
}
