import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader, FormControl, Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function MatchResults() {
  const { divisions, allMatches, allTeams } = useAppContext();
  const [weekNumbers, setWeekNumbers] = useState([]);
  const [divisionId, setDivisionId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [filteredMatches, setFilteredMatches] = useState([]);

  useEffect(() => {
    if (allMatches.length > 0) {
      setFilteredMatches(allMatches);
      setWeekNumbers([...new Set(allMatches.map((match) => match.weekNumber))]);
    }
  }, [allMatches]);

  useEffect(() => {
    setFilteredMatches(allMatches.filter((match) => {
      const home = match.homeTeamId && allTeams.find((team) => team.teamId === match.homeTeamId);
      const visitor = match.visitorTeamId && allTeams.find((team) => team.teamId === match.visitorTeamId);
      return (
        (divisionId === "" || (home && home.divisionId === divisionId) || (visitor && visitor.divisionId === divisionId)) &&
        (teamId === "" || match.homeTeamId === teamId || match.visitorTeamId === teamId) &&
        (weekNumber === "" || match.weekNumber === weekNumber)
      );
    }));
  }, [divisionId, teamId, weekNumber, allTeams, allMatches]);

  return (
    <div className="container">
      <PageHeader>Match Results</PageHeader>
      <div className="centered-content">
        <div>
          <FormControl
            className="match-results-dropdown"
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
          <FormControl
            className="match-results-dropdown"
            value={teamId}
            componentClass="select"
            onChange={e => setTeamId(e.target.value)}
          >
            <option value="">All teams</option>
            {allTeams.filter((team) => divisionId === "" || team.divisionId === divisionId).map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {`${team.teamName} only`}
              </option>
            ))}
          </FormControl>
          <FormControl
            className="match-results-dropdown"
            value={weekNumber}
            componentClass="select"
            onChange={e => setWeekNumber(e.target.value)}
          >
            <option value="">All weeks</option>
            {weekNumbers.map((weekNumber) => (
              <option key={weekNumber} value={weekNumber}>
                {`Week ${weekNumber} only`}
              </option>
            ))}
          </FormControl>
          <Table bordered hover className="interactive-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Home</th>
                <th>Visitor</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => {
              const home = match.homeTeamId && allTeams.find((team) => team.teamId === match.homeTeamId);
              const visitor = match.visitorTeamId && allTeams.find((team) => team.teamId === match.visitorTeamId);
                return (
                  <tr key={match.matchId} onClick={() => window.location.pathname = `/match-results/${match.matchId}`}>
                    <td>{match.matchDate ? moment(match.matchDate).format("M/D/YYYY") : ''}</td>
                    <td>{home ? home.teamName : ''}</td>
                    <td>{visitor ? visitor.teamName : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
