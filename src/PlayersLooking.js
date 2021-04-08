import React, { useEffect, useState } from "react";
import { PageHeader, Table } from "react-bootstrap";
import { API } from "aws-amplify";
import moment from "moment";
import zipcelx from "zipcelx";

export default () => {
  const [playersLooking, setPlayersLooking] = useState([]);

  useEffect(() => {
    const getPlayersLooking = async () => {
      const players = await API.get("atl-backend", `list/player`);
      setPlayersLooking(players.filter((player) => !player.teamId));
    };
    getPlayersLooking();
  }, []);

  const columns = [
    { label: 'Number', value: (player) => player.playerNumber || "" },
    { label: 'Date Submitted', value: (player) => moment(player.createdAt).format('MMM. D, YYYY') },
    { label: 'Name', value: (player) => `${player.firstName || ""} ${player.lastName || ""}` },
    { label: 'Phone', value: (player) => player.phone || "" },
    { label: 'Email', value: (player) => player.email || "" },
    { label: 'Rating', value: (player) => player.rating || "" },
    { label: 'Rating Type', value: (player) => player.ratingType || "" },
    { label: 'Gender', value: (player) => player.gender || "" },
    { label: 'Birth Year', value: (player) => player.birthYear || "" },
    { label: 'USTA?', value: (player) => player.usta || "" },
    { label: 'USTA Level', value: (player) => player.ustaLevel || "" },
    { label: 'USTA Year', value: (player) => player.ustaYear || "" },
    { label: 'Experience', value: (player) => player.experience || "" },
    { label: 'Comments', value: (player) => player.comments || "" },
  ];

  const downloadExcel = () => {
    const headerRow = columns.map((column) => ({ value: column.label, type: "string" }));
    const dataRows = playersLooking.map((player) => columns.map((column) => ({
      value: column.value(player), type: "string"
    })));
    const data = [headerRow].concat(dataRows);
    zipcelx({ filename: `ATL - Players Looking for a Team`, sheet: { data } });
  };

  return (
    <div className="container">
      <PageHeader>Players Looking for a Team</PageHeader>
      <div className="centered-content">
        {playersLooking.length > 0 ? (
          <div className="table-container">
            <Table bordered>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.label}>{column.label}</th>
                  ))}
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
                      {columns.map((column) => (
                        <td key={column.label}>{column.value(player)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <p className="centered-text">
              <b>Download list of players:</b>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={downloadExcel} className="download-schedule-link">
                <i className="fas fa-file-excel" />
                Excel
              </a>
            </p>
          </div>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}
