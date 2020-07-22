import React, { useEffect, useState } from "react";
import { PageHeader, Table } from "react-bootstrap";
import { API } from "aws-amplify";
import { useAppContext } from "./libs/contextLib";

export default function TeamRoster() {
  const { allTeams } = useAppContext();
  const [team, setTeam] = useState({});
  const [roster, setRoster] = useState([]);
  const teamId = window.location.pathname.split("roster/")[1];
  useEffect(() => {
    if (allTeams && allTeams.length > 0) {
      const getTeamInfo = async () => {
        const teamInfo = allTeams.find((teamInList) => teamInList.teamId === teamId);
        const players = await API.get("atl-backend", `list/player?teamId=${teamId}`);
        setTeam(teamInfo);
        setRoster(players);
      };
      if (teamId && teamId.length > 0) getTeamInfo();
    }
  }, [allTeams, teamId]);
  if (!teamId || teamId.length === 0) {
    window.location.pathname = "/team-listing";
    return <div className="container" />;
  } else if (team) {
    return (
      <div className="container">
        <PageHeader>{team.teamName}</PageHeader>
        <div className="centered-content">
          <Table bordered>
            <thead>
              <tr>
                <th />
                <th>Player Name</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((player, index) => (
                <tr key={player.playerId}>
                  <td>{index + 1}</td>
                  <td>{`${player.firstName || ''} ${player.lastName || ''}`}</td>
                  <td>{player.rating || ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  } else return <div className="container" />;
}
