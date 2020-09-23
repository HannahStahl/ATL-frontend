import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import zipcelx from "zipcelx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import AddPlayerModal from "./AddPlayerModal";
import RosterPDF from "./RosterPDF";

export default ({ team }) => {
  const { loadingData } = useAppContext();
  const [allPlayers, setAllPlayers] = useState([]);
  const [addingPlayer, setAddingPlayer] = useState(false);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

  const columns = {
    "playerNumber": {
      label: "Number",
      readOnly: true
    },
    "name": {
      label: "Name",
      children: [
        { key: "firstName", label: "First Name", type: "text", required: true },
        { key: "lastName", label: "Last Name", type: "text", required: true },
      ]
    },
    "phone": { label: "Phone", type: "text", placeholder: "xxx-xxx-xxxx" },
    "email": { label: "Email", type: "email" },
    "rating": {
      label: "Rating",
      type: "number",
      step: 0.5,
      render: (rating) => rating ? parseFloat(rating).toFixed(1) : ""
    },
    "ratingType": {
      label: "Rating Type",
      type: "dropdown",
      options: [{ value: "U", name: "USTA Rating" }, { value: "S", name: "Self Rating" }]
    },
    "gender": {
      label: "Gender",
      type: "dropdown",
      options: [{ value: "F", name: "Female" }, {value: "M", name: "Male" }],
    },
    "birthYear": { label: "Birth Year", type: "number" },
    "usta": {
      label: "USTA?",
      type: "dropdown",
      options: [{ value: "Y", name: "Yes" }, { value: "N", name: "No" }]
    },
    "ustaLevel": { label: "USTA Level", type: "text" },
    "ustaYear": { label: "USTA Year", type: "number" },
    "experience": { label: "Experience", type: "textarea" },
    "comments": { label: "Comments", type: "textarea" },
  };

  const exportFields = ["playerNumber", "name", "phone", "email"];

  const { teamId } = team;

  const removePlayerFromTeam = async (playerId) => {
    const index = allPlayers.findIndex((player) => player.playerId === playerId);
    await API.post("atl-backend", `deactivatePlayer/${playerId}`);
    allPlayers.splice(index, 1);
    setAllPlayers([...allPlayers]);
  };

  const AddPlayerComponent = () => (
    <td
      colSpan={Object.keys(columns).filter((key) => !columns[key].hideFromTable).length + 1}
      onClick={() => setAddingPlayer(true)}
    >
      + Add a player
    </td>
  );

  const filterPlayers = (list) => list.filter((player) => player.teamId === teamId);

  const getExportValue = (player, key) => {
    if (key === "name") return `${player.firstName || ""} ${player.lastName || ""}`;
    else return player[key] || "";
  };

  const downloadExcel = () => {
    const roster = filterPlayers(allPlayers);
    const headerRow = exportFields.map((key) => ({ value: columns[key].label, type: "string" }));
    const dataRows = roster.map((player) => exportFields.map((key) => ({
      value: getExportValue(player, key), type: "string"
    })));
    const data = [headerRow].concat(dataRows);
    zipcelx({ filename: `ATL Team Roster - ${team.teamName}`, sheet: { data } });
  };

  return !loadingData && teamId ? (
    <>
      <hr className="team-details-page-break" />
      <h1 className="team-details-page-header">Roster</h1>
      <Table
        columns={columns}
        rows={allPlayers}
        filterRows={filterPlayers}
        setRows={setAllPlayers}
        getRows={() => API.get("atl-backend", "/list/player")}
        itemType="player"
        API={API}
        CustomAddComponent={AddPlayerComponent}
        customRemoveFunction={removePlayerFromTeam}
        categoryName="team"
      />
      <p className="centered-text">
        <b>Download roster:</b>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a onClick={downloadExcel} className="download-schedule-link">
          <i className="fas fa-file-excel" />
          Excel
        </a>
        <span className="download-schedule-link">
          <PDFDownloadLink
            key={Math.random()}
            document={
              <RosterPDF
                exportFields={exportFields}
                columns={columns}
                players={filterPlayers(allPlayers)}
                getValue={getExportValue}
              />
            }
            fileName={`ATL Team Roster - ${team.teamName}.pdf`}
          >
            <i className="fas fa-file-pdf" />
            PDF
          </PDFDownloadLink>
        </span>
      </p>
      <div className="centered-content">
        <a href="/players-looking">View list of players looking for a team</a>
      </div>
      <AddPlayerModal
        columns={columns}
        activePlayers={allPlayers}
        setActivePlayers={setAllPlayers}
        teamId={teamId}
        addingPlayer={addingPlayer}
        setAddingPlayer={setAddingPlayer}
      />
    </>
  ) : <div />;
}
