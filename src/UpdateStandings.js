import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import zipcelx from "zipcelx";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import LoaderButton from "./LoaderButton";
import StandingsPDF from "./StandingsPDF";

export default () => {
  const { standings, setStandings, allTeams, loadingData, seasons } = useAppContext();
  const [updatingStandings, setUpdatingStandings] = useState(false);
  const [updatedStandings, setUpdatedStandings] = useState(false);

  const currentSeason = seasons.find((season) => season.currentSeason);

  const columns = {
    teamId: {
      label: "Team Name",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    },
    setsWon: { label: "Sets Won" },
    setsLost: { label: "Sets Lost" },
    setsPlayed: { label: "Total Sets" },
    percentSetsWon: { label: "%", render: (value) => (parseFloat(value || 0) * 100).toFixed(2) },
    setsForfeited: { label: "Sets Forfeited", type: "number" }
  };

  const getExportValue = (team, key) => {
    if (key === "teamId") return allTeams.find((teamInList) => teamInList.teamId === team.teamId).teamName;
    if (key === "percentSetsWon") return (parseFloat(team.percentSetsWon || 0) * 100).toFixed(2);
    else return team[key];
  };

  const downloadExcel = () => {
    const headerRow = Object.keys(columns).map((key) => ({ value: columns[key].label, type: "string" }));
    const dataRows = standings.map((team) => Object.keys(columns).map((key) => ({
      value: getExportValue(team, key), type: "string"
    })));
    const data = [headerRow].concat(dataRows);
    zipcelx({ filename: `ATL Standings - ${currentSeason.seasonName}`, sheet: { data } });
  };

  const updateStandings = async () => {
    setUpdatingStandings(true);
    await API.put("atl-backend", "update/standing/all").then(() => {
      setUpdatingStandings(false);
      setUpdatedStandings(true);
    });
    const updatedStandings = await API.get("atl-backend", "list/standing");
    setStandings(updatedStandings);
  };

  return (
    <div className="container">
      <PageHeader>Standings</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
          <Table
            columns={columns}
            rows={standings}
            itemType="standing"
            primaryKey="teamId"
          />
          <p className="centered-text">
            <b>Download standings:</b>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={downloadExcel} className="download-schedule-link">
              <i className="fas fa-file-excel" />
              Excel
            </a>
            <span className="download-schedule-link">
              <PDFDownloadLink
                key={Math.random()}
                document={
                  <StandingsPDF
                    columns={columns}
                    standings={standings}
                    getValue={getExportValue}
                  />
                }
                fileName={`ATL Standings - ${currentSeason.seasonName}.pdf`}
              >
                <i className="fas fa-file-pdf" />
                PDF
              </PDFDownloadLink>
            </span>
          </p>
          <div className="centered-content">
            <LoaderButton
              bsSize="large"
              bsStyle="primary"
              onClick={updateStandings}
              isLoading={updatingStandings}
              className="update-standings-btn"
            >
              Update Standings
            </LoaderButton>
          </div>
          <div className="centered-content">
            {updatedStandings && (
              <p>
                <i className="fas fa-check updated-standings" />
                Updated
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
