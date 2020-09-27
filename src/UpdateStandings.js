import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import zipcelx from "zipcelx";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import LoaderButton from "./LoaderButton";
import StandingsPDF from "./StandingsPDF";
import PlayerResultsPDF from "./PlayerResultsPDF";

export default () => {
  const { divisions, standings, setStandings, allTeams, loadingData, seasons, matchResults } = useAppContext();
  const [sortedStandings, setSortedStandings] = useState([]);
  const [updatingStandings, setUpdatingStandings] = useState(false);
  const [updatedStandings, setUpdatedStandings] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);
  const [loadingPlayerResults, setLoadingPlayerResults] = useState(true);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setPlayers);
  }, []);

  useEffect(() => {
    if (standings && standings.length > 0 && sortedStandings.length === 0) {
      const standingsWithDivisions = standings.map((standing) => {
        const { divisionId } = allTeams.find(({ teamId }) => teamId === standing.teamId);
        const { divisionNumber } = divisions.find((division) => division.divisionId === divisionId);
        return { ...standing, divisionNumber };
      });
      setSortedStandings(standingsWithDivisions.sort((a, b) => {
        if (a.divisionNumber < b.divisionNumber) return -1;
        if (b.divisionNumber < a.divisionNumber) return 1;
        if (a.percentSetsWon > b.percentSetsWon) return -1;
        if (b.percentSetsWon > a.percentSetsWon) return 1;
        return 0;
      }));
    }
  }, [standings, sortedStandings, allTeams, divisions]);

  useEffect(() => {
    if(
      loadingPlayerResults &&
      allTeams.length > 0 &&
      players.length > 0 &&
      matchResults.length > 0 &&
      playerResults.length === 0
    ) {
      let rows = [];
      allTeams
      .filter((team) => team.isActive && team.teamName !== "Bye")
      .sort((a, b) => a.teamNumber - b.teamNumber)
      .forEach((team) => {
        const { teamId, teamNumber, teamName } = team;
        const roster = players.filter((player) => player.teamId === teamId);
        const rosterResults = [];
        roster.forEach(({ playerId, firstName, lastName }) => {
          let numSetsWon = 0;
          let numSetsLost = 0;
          let numMatches = 0;
          matchResults.forEach((matchResult) => {
            Object.keys(matchResult).forEach((key) => {
              if (key.includes("Player") && matchResult[key] === playerId) {
                const home = key.includes("Home");
                const line = key.split(home ? "Home" : "Visitor")[0];
                const setsWon = matchResult[`${line}${home ? 'Home' : 'Visitor'}SetsWon`] || 0;
                const setsLost = matchResult[`${line}${home ? 'Visitor' : 'Home'}SetsWon`] || 0;
                numSetsWon += parseFloat(setsWon);
                numSetsLost += parseFloat(setsLost);
                numMatches += 1;
              }
            });
          });
          const percentSetsWon = numMatches > 0 ? ((numSetsWon / (numSetsWon + numSetsLost)) * 100).toFixed(2) : 0;
          rosterResults.push({
            teamNumber, teamName, firstName, lastName, numSetsWon, numSetsLost, percentSetsWon, numMatches,
          });
        });
        const sortedResults = rosterResults.sort((a, b) => b.numMatches - a.numMatches);
        rows = rows.concat(sortedResults);
      });
      setPlayerResults(rows);
      setLoadingPlayerResults(false);
    }
  }, [allTeams, players, matchResults, playerResults, loadingPlayerResults]);

  const currentSeason = seasons.find((season) => season.currentSeason);

  const columns = {
    divisionNumber: { label: "Division" },
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

  const playerColumns = [
    { key: "teamNumber", label: "Team #" },
    { key: "teamName", label: "Team Name" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "numSetsWon", label: "Sets Won" },
    { key: "numSetsLost", label: "Sets Lost" },
    { key: "percentSetsWon", label: "%" },
    { key: "numMatches", label: "Matches Played" },
  ];

  const downloadExcel = () => {
    const headerRow = Object.keys(columns).map((key) => ({ value: columns[key].label, type: "string" }));
    const dataRows = sortedStandings.map((team) => Object.keys(columns).map((key) => ({
      value: getExportValue(team, key), type: "string"
    })));
    const data = [headerRow].concat(dataRows);
    zipcelx({ filename: `ATL Standings - ${currentSeason.seasonName}`, sheet: { data } });
  };

  const downloadPlayersExcel = () => {
    const headerRow = playerColumns.map((column) => ({ value: column.label, type: "string" }));
    const dataRows = playerResults.map((player) => playerColumns.map((column) => ({
      value: player[column.key], type: "string"
    })));
    const data = [headerRow].concat(dataRows);
    zipcelx({ filename: `ATL Player Results - ${currentSeason.seasonName}`, sheet: { data } });
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
            rows={sortedStandings}
            itemType="standing"
            primaryKey="teamId"
          />
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
                    standings={sortedStandings}
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
          {!loadingPlayerResults && (
            <p className="centered-text">
              <b>Download player results:</b>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={downloadPlayersExcel} className="download-schedule-link">
                <i className="fas fa-file-excel" />
                Excel
              </a>
              <span className="download-schedule-link">
                <PDFDownloadLink
                  key={Math.random()}
                  document={
                    <PlayerResultsPDF columns={playerColumns} playerResults={playerResults} />
                  }
                  fileName={`ATL Player Results - ${currentSeason.seasonName}.pdf`}
                >
                  <i className="fas fa-file-pdf" />
                  PDF
                </PDFDownloadLink>
              </span>
            </p>
          )}
        </>
      )}
    </div>
  );
}
