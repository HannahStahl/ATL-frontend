import React, { useEffect, useState } from "react";
import { PageHeader, Table } from "react-bootstrap";
import { API } from "aws-amplify";

export default () => {
  const [playersLooking, setPlayersLooking] = useState([]);

  useEffect(() => {
    const getPlayersLooking = async () => {
      const players = await API.get("atl-backend", `list/player`);
      setPlayersLooking(players.filter((player) => !player.teamId));
    };
    getPlayersLooking();
  }, []);

  return (
    <div className="container">
      <PageHeader>Players Looking for a Team</PageHeader>
      <div className="centered-content">
        {playersLooking.length > 0 ? (
          <div className="table-container">
            <Table bordered>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Rating Type</th>
                  <th>Gender</th>
                  <th>Birth Year</th>
                  <th>USTA?</th>
                  <th>USTA Level</th>
                  <th>USTA Year</th>
                  <th>Experience</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {playersLooking.sort((a, b) => {
                  if (!a.rating || a.rating < b.rating) return -1;
                  if (!b.rating || a.rating > b.rating) return 1;
                  return 0;
                }).map((player) => {
                  return (
                    <tr key={player.playerId}>
                      <td>{player.playerNumber || ""}</td>
                      <td>{`${player.firstName || ""} ${player.lastName || ""}`}</td>
                      <td>{player.phone || ""}</td>
                      <td>{player.email || ""}</td>
                      <td>{player.rating || ""}</td>
                      <td>{player.ratingType || ""}</td>
                      <td>{player.gender || ""}</td>
                      <td>{player.birthYear || ""}</td>
                      <td>{player.usta || ""}</td>
                      <td>{player.ustaLevel || ""}</td>
                      <td>{player.ustaYear || ""}</td>
                      <td>{player.experience || ""}</td>
                      <td>{player.comments || ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}
