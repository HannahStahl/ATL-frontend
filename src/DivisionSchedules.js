import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader, Table, FormControl } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default function DivisionSchedules() {
  const { divisions, allTeams, allCaptains, matches, locations } = useAppContext();
  const [division, setDivision] = useState(undefined);
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    setDivision(divisions[0]);
  }, [divisions]);

  useEffect(() => {
    if (allTeams && allTeams.length > 0 && division) {
      setTeams(allTeams.filter((team) => team.divisionId === division.divisionId));
    }
  }, [allTeams, division]);

  useEffect(() => {
    const teamIds = teams.map((team) => team.teamId);
    setSchedule(matches.filter((match) => teamIds.includes(match.homeTeamId) || teamIds.includes(match.visitorTeamId)));
  }, [matches, teams]);

  return (
    <div className="container">
      <PageHeader>Match Schedules</PageHeader>
      {division && (
        <FormControl
          className="schedules-intro"
          value={(division && division.divisionId) || ''}
          componentClass="select"
          onChange={e => setDivision(divisions.find((divisionInList) => divisionInList.divisionId === e.target.value))}
        >
          {divisions.map((divisionInList) => (
            <option key={divisionInList.divisionId} value={divisionInList.divisionId}>
              {`Division ${divisionInList.divisionNumber}`}
            </option>
          ))}
        </FormControl>
      )}
      <div className="centered-content">
        {teams.length > 0 && (
          <Table bordered>
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Captain/Co-Captain</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => {
                const { captainId, cocaptainId } = team;
                const captain = captainId && allCaptains.find((captainInList) => captainInList.userId === captainId);
                const cocaptain = cocaptainId && allCaptains.find((captainInList) => captainInList.userId === cocaptainId);
                return (
                  <tr key={team.teamId}>
                    <td>{team.teamName}</td>
                    <td>
                      {captain ? `${captain.firstName || ""} ${captain.lastName || ""}` : ""}
                      {captain && cocaptain ? ", " : ""}
                      {cocaptain ? `${cocaptain.firstName || ""} ${cocaptain.lastName || ""}` : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
      <div className="centered-content">
        <p>The home team must supply 4 cans of USTA-approved tennis balls.</p>
      </div>
      <div className="centered-content">
      {schedule.length > 0 && (
        <Table bordered>
          <thead>
            <tr>
              <th>Week</th>
              <th>Date</th>
              <th>Home</th>
              <th>Visitor</th>
              <th>Location</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((match) => {
              const home = match.homeTeamId && allTeams.find((team) => team.teamId === match.homeTeamId);
              const visitor = match.visitorTeamId && allTeams.find((team) => team.teamId === match.visitorTeamId);
              const location = locations.find((locationInList) => locationInList.locationId === match.locationId);
              return (
                <tr key={match.matchId}>
                  <td>{match.weekNumber || ""}</td>
                  <td>{match.matchDate ? moment(match.matchDate).format("M/D/YYYY") : ""}</td>
                  <td>{home ? home.teamName : ""}</td>
                  <td>{visitor ? visitor.teamName : ""}</td>
                  <td>{location ? location.locationName : ""}</td>
                  <td>{match.startTime}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      </div>
    </div>
  );
}
