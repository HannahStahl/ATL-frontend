import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader, FormGroup, FormControl, Modal } from "react-bootstrap";
import { API } from "aws-amplify";
import zipcelx from "zipcelx";
import * as XLSX from "xlsx";
import { pdf } from "@react-pdf/renderer";
import { uniq } from "lodash";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { saveAs } from 'file-saver';
import SchedulePDF from "./SchedulePDF";
import LoaderButton from "./LoaderButton";
import StandingsPDF from "./StandingsPDF";
import PlayerResultsPDF from "./PlayerResultsPDF";

export default () => {
  const {
    allMatches, setAllMatches, draftMatches, setDraftMatches, divisions, standings,
    setStandings, matchResults, setMatchResults, locations, allTeams, seasons, loadingData
  } = useAppContext();
  const [locationId, setLocationId] = useState("");
  const [allPlayers, setAllPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [draftView, setDraftView] = useState(false);
  const [adding, setAdding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [sortedStandings, setSortedStandings] = useState([]);
  const [playerResults, setPlayerResults] = useState([]);
  const [loadingPlayerResults, setLoadingPlayerResults] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [teamsById, setTeamsById] = useState({});
  const [matchResultsById, setMatchResultsById] = useState({});
  const [divisionsById, setDivisionsById] = useState({});
  const currentSeason = seasons.find((season) => season.currentSeason);

  useEffect(() => {
    if (!loadingData && allMatches.length > 0) {
      const newMatchResultsById = {};
      matchResults.forEach((matchResult) => {
        newMatchResultsById[matchResult.matchId] = matchResult;
      });
      setMatchResultsById(newMatchResultsById);
      const matches = allMatches.map((match) => {
        const matchResult = newMatchResultsById[match.matchId];
        return { ...match, ...matchResult };
      });
      setMatches(matches);
    }
  }, [loadingData, allMatches, matchResults]);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

  useEffect(() => {
    if (
      standings && standings.length > 0 &&
      sortedStandings.length === 0 &&
      allTeams.length > 0 &&
      divisions.length > 0
    ) {
    const newTeamsById = {};
    allTeams.forEach((team) => {
      newTeamsById[team.teamId] = team;
    });
    setTeamsById(newTeamsById);
    const newDivisionsById = {};
    divisions.forEach((division) => {
      newDivisionsById[division.divisionId] = division;
    });
    setDivisionsById(newDivisionsById);
      const standingsWithDivisions = [];
      standings.forEach((standing) => {
        const team = newTeamsById[standing.teamId];
        if (team) {
          const { divisionId, teamName } = team;
          if (teamName !== "Bye" && divisionId && divisionId.length > 0) {
            const { divisionNumber } = newDivisionsById[divisionId];
            standingsWithDivisions.push({ ...standing, divisionNumber });
          }
        }
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
      allPlayers.length > 0 &&
      matchResults.length > 0 &&
      playerResults.length === 0
    ) {
      let rows = [];
      allTeams
      .filter((team) => team.isActive && team.teamName !== "Bye")
      .sort((a, b) => a.teamNumber - b.teamNumber)
      .forEach((team) => {
        const { teamId, teamNumber, teamName } = team;
        const roster = allPlayers.filter((player) => player.teamId === teamId);
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
  }, [allTeams, allPlayers, matchResults, playerResults, loadingPlayerResults]);

  const playerColumn = (label, home) => ({
    label,
    type: "dropdown",
    joiningTable: allPlayers,
    joiningTableFilter: {
      key: home ? "homeTeamId" : "visitorTeamId",
      joiningTableKey: "teamId"
    },
    joiningTableKey: "playerId",
    joiningTableFieldNames: ["firstName", "lastName"]
  });

  const doublesColumn = (label, home, children) => ({
    label,
    children: children.map((child) => ({ key: child.key, ...playerColumn(child.label, home) })),
    childrenJoiner: ', '
  });

  let columns = {
    weekNumber: {
      label: "Week",
      type: "number",
      required: true,
      sortFunction: (a, b) => parseInt(a) - parseInt(b),
    },
    matchNumber: {
      label: "Match #",
      type: "number",
      required: true,
      sortFunction: (a, b) => parseInt(a) - parseInt(b),
    },
    divisionId: {
      label: "Division",
      type: "dropdown",
      joiningTable: divisions,
      joiningTableKey: "divisionId",
      joiningTableFieldNames: ["divisionNumber"],
      sortFunction: (a, b) => parseInt(a) - parseInt(b),
    },
    matchDate: {
      label: "Date",
      type: "date",
      render: (value) => value && moment(value).format("M/D/YYYY"),
      sortFunction: (a, b) => moment(a).isBefore(b) ? -1 : 1,
    },
    startTime: {
      label: "Time",
      type: "text",
      sortFunction: (a, b) => {
        let hour1 = parseInt(a.split('-')[0]);
        let hour2 = parseInt(b.split('-')[0]);
        if (hour1 <= 6) hour1 += 12; // assume PM
        if (hour2 <= 6) hour2 += 12; // assume PM
        return hour1 - hour2;
      },
    },
    locationId: {
      label: "Location",
      type: "dropdown",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"],
      sortFunction: (a, b) => a < b ? -1 : 1,
    },
    homeTeamId: {
      label: "Home Team",
      type: "dropdown",
      joiningTable: allTeams.filter((team) => team.isActive),
      joiningTableFilter: {
        key: "divisionId",
        joiningTableKey: "divisionId"
      },
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
    },
    visitorTeamId: {
      label: "Visiting Team",
      type: "dropdown",
      joiningTable: allTeams.filter((team) => team.isActive),
      joiningTableFilter: {
        key: "divisionId",
        joiningTableKey: "divisionId"
      },
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
    }
  };

  if (!draftView) {
    const additionalColumns = {
      singles1HomePlayerId: playerColumn("S1 Home Player", true),
      singles1VisitorPlayerId: playerColumn("S1 Visitor Player", false),
      singles2HomePlayerId: playerColumn("S2 Home Player", true),
      singles2VisitorPlayerId: playerColumn("S2 Visitor Player", false),
      doubles1HomePlayers: doublesColumn("D1 Home Players", true, [
        { key: "doubles1HomePlayer1Id", label: "D1 Home Players" },
        { key: "doubles1HomePlayer2Id" }
      ]),
      doubles1VisitorPlayers: doublesColumn("D1 Visitor Players", false, [
        { key: "doubles1VisitorPlayer1Id", label: "D1 Visitor Players" },
        { key: "doubles1VisitorPlayer2Id" }
      ]),
      doubles2HomePlayers: doublesColumn("D2 Home Players", true, [
        { key: "doubles2HomePlayer1Id", label: "D2 Home Players" },
        { key: "doubles2HomePlayer2Id" }
      ]),
      doubles2VisitorPlayers: doublesColumn("D2 Visitor Players", false, [
        { key: "doubles2VisitorPlayer1Id", label: "D2 Visitor Players" },
        { key: "doubles2VisitorPlayer2Id" }
      ]),
      singles1Score: { label: "S1 Score", type: "text" },
      singles2Score: { label: "S2 Score", type: "text" },
      doubles1Score: { label: "D1 Score", type: "text" },
      doubles2Score: { label: "D2 Score", type: "text" },
      singles1HomeSetsWon: { label: "S1 Home Sets Won", type: "number", hideFromTable: true },
      singles1VisitorSetsWon: { label: "S1 Visitor Sets Won", type: "number", hideFromTable: true },
      singles2HomeSetsWon: { label: "S2 Home Sets Won", type: "number", hideFromTable: true },
      singles2VisitorSetsWon: { label: "S2 Visitor Sets Won", type: "number", hideFromTable: true },
      doubles1HomeSetsWon: { label: "D1 Home Sets Won", type: "number", hideFromTable: true },
      doubles1VisitorSetsWon: { label: "D1 Visitor Sets Won", type: "number", hideFromTable: true },
      doubles2HomeSetsWon: { label: "D2 Home Sets Won", type: "number", hideFromTable: true },
      doubles2VisitorSetsWon: { label: "D2 Visitor Sets Won", type: "number", hideFromTable: true },
      totalHomeSetsWon: { label: "Home Sets Won", type: "number", readOnly: true },
      totalVisitorSetsWon: { label: "Visitor Sets Won", type: "number", readOnly: true },
      homeSetsForfeited: { label: "Home Sets Forfeited", type: "number" },
      visitorSetsForfeited: { label: "Visitor Sets Forfeited", type: "number" },
      homeVerified: {
        label: "Verified by Home",
        type: "checkbox",
        render: (value) => value ? <i className="fas fa-check" /> : ""
      },
      visitorVerified: {
        label: "Verified by Visitor",
        type: "checkbox",
        render: (value) => value ? <i className="fas fa-check" /> : ""
      }
    };
    columns = { ...columns, ...additionalColumns };
  };

  const filterMatches = (list) => locationId === "" ? list : list.filter((match) => match.locationId === locationId);

  const validate = (body) => {
    const { homeTeamId, visitorTeamId, matchNumber, matchId } = body;
    if (homeTeamId && visitorTeamId && homeTeamId.length > 0 && visitorTeamId.length > 0 && homeTeamId === visitorTeamId) {
      onError("Home team and visiting team must be different.");
      return false;
    }
    const otherMatches = draftView ? draftMatches : allMatches;
    const otherMatchNumbers = otherMatches.filter((match) => match.matchId !== matchId).map((match) => match.matchNumber);
    if (matchNumber && matchNumber.length > 0 && otherMatchNumbers.indexOf(matchNumber) > -1 ) {
      onError("Match number must be unique.");
      return false;
    }
    return true;
  };

  const getTotalHomeSetsWon = (match) => (
    parseInt(match.singles1HomeSetsWon || 0) +
    parseInt(match.singles2HomeSetsWon || 0) +
    parseInt(match.doubles1HomeSetsWon || 0) +
    parseInt(match.doubles2HomeSetsWon || 0)
  );

  const getTotalVisitorSetsWon = (match) => (
    parseInt(match.singles1VisitorSetsWon || 0) +
    parseInt(match.singles2VisitorSetsWon || 0) +
    parseInt(match.doubles1VisitorSetsWon || 0) +
    parseInt(match.doubles2VisitorSetsWon || 0)
  );

  const updateSortedStandings = (updatedStandings) => {
    const standingsWithDivisions = updatedStandings.map((standing) => {
      const { divisionId } = teamsById[standing.teamId];
      const { divisionNumber } = divisionsById[divisionId];
      return { ...standing, divisionNumber };
    });
    setSortedStandings(standingsWithDivisions.sort((a, b) => {
      if (a.divisionNumber < b.divisionNumber) return -1;
      if (b.divisionNumber < a.divisionNumber) return 1;
      if (a.percentSetsWon > b.percentSetsWon) return -1;
      if (b.percentSetsWon > a.percentSetsWon) return 1;
      return 0;
    }));
  };

  const updatePlayerResults = (updatedMatchResults) => {
    let rows = [];
    allTeams
    .filter((team) => team.isActive && team.teamName !== "Bye")
    .sort((a, b) => a.teamNumber - b.teamNumber)
    .forEach((team) => {
      const { teamId, teamNumber, teamName } = team;
      const roster = allPlayers.filter((player) => player.teamId === teamId);
      const rosterResults = [];
      roster.forEach(({ playerId, firstName, lastName }) => {
        let numSetsWon = 0;
        let numSetsLost = 0;
        let numMatches = 0;
        updatedMatchResults.forEach((matchResult) => {
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
  };

  const addMatch = async (body) => {
    if (draftView) {
      await API.post("atl-backend", "create/draftMatch", { body });
      const updatedMatches = await API.get("atl-backend", "list/draftMatch");
      setDraftMatches([...updatedMatches]);
    } else {
      body.totalHomeSetsWon = getTotalHomeSetsWon(body);
      body.totalVisitorSetsWon = getTotalVisitorSetsWon(body);
      const { matchId } = await API.post("atl-backend", "create/match", { body });
      await API.post("atl-backend", "create/matchResult", { body: { ...body, matchId } })
      const [updatedMatches, updatedMatchResults, updatedStandings] = await Promise.all([
        API.get("atl-backend", "list/match"),
        API.get("atl-backend", "list/matchResult"),
        API.get("atl-backend", "list/standing")
      ]);
      setAllMatches([...updatedMatches]);
      setMatchResults([...updatedMatchResults]);
      setStandings([...updatedStandings]);
      updateSortedStandings(updatedStandings);
      updatePlayerResults(updatedMatchResults);
    }
  };

  const editMatch = async (matchId, body) => {
    if (draftView) {
      await API.put("atl-backend", `update/draftMatch/${matchId}`, { body });
      const updatedMatches = await API.get("atl-backend", "list/draftMatch");
      setDraftMatches([...updatedMatches]);
    } else {
      body.totalHomeSetsWon = getTotalHomeSetsWon(body);
      body.totalVisitorSetsWon = getTotalVisitorSetsWon(body);
      const promises = [API.put("atl-backend", `update/match/${matchId}`, { body })];
      if (matchResultsById[body.matchId]) {
        promises.push(API.put("atl-backend", `update/matchResult/${matchId}`, { body }));
      } else {
        promises.push(API.post("atl-backend", "create/matchResult", { body }));
      }
      await Promise.all(promises);
      const [updatedMatches, updatedMatchResults, updatedStandings] = await Promise.all([
        API.get("atl-backend", "list/match"),
        API.get("atl-backend", "list/matchResult"),
        API.get("atl-backend", "list/standing")
      ]);
      setAllMatches([...updatedMatches]);
      setMatchResults([...updatedMatchResults]);
      setStandings([...updatedStandings]);
      updateSortedStandings(updatedStandings);
      updatePlayerResults(updatedMatchResults);
    }
  };

  const deleteMatch = async (matchId) => {
    if (draftView) {
      await API.del("atl-backend", `delete/draftMatch/${matchId}`);
      const updatedMatches = await API.get("atl-backend", "list/draftMatch");
      setDraftMatches([...updatedMatches]);
    } else {
      const promises = [API.del("atl-backend", `delete/match/${matchId}`)];
      if (matchResultsById[matchId]) {
        promises.push(API.del("atl-backend", `delete/matchResult/${matchId}`));
      }
      await Promise.all(promises);
      const [updatedMatches, updatedMatchResults, updatedStandings] = await Promise.all([
        API.get("atl-backend", "list/match"),
        API.get("atl-backend", "list/matchResult"),
        API.get("atl-backend", "list/standing")
      ]);
      setAllMatches([...updatedMatches]);
      setMatchResults([...updatedMatchResults]);
      setStandings([...updatedStandings]);
      updateSortedStandings(updatedStandings);
      updatePlayerResults(updatedMatchResults);
    }
  }

  const dataKeys = ["matchNumber", "weekNumber", "matchDate", "startTime", "locationId", "homeTeamId", "visitorTeamId"];

  const getValue = (match, key) => {
    let value = match[key] || "";
    if (key === "locationId" && value.length > 0) {
      const location = locations.find((locationInList) => locationInList.locationId === value);
      value = location ? (location.locationName || "") : "";
    } else if ((key === "homeTeamId" || key === "visitorTeamId") && value && value.length > 0) {
      const team = teamsById[value];
      value = team ? (team.teamName || "") : "";
    }
    return value;
  };

  const downloadExcel = () => {
    const matches = filterMatches(draftView ? draftMatches : allMatches);
    const headerRow = dataKeys.map((key) => ({
      value: columns[key].label, type: "string"
    }));
    const dataRows = matches.map((match) => dataKeys.map((key) => {
      return ({ value: getValue(match, key), type: "string" });
    }));
    const data = [headerRow].concat(dataRows);
    zipcelx({
      filename: "ATL Match Schedule",
      sheet: { data }
    });
  };

  const addToSchedule = async () => {
    setAdding(true);
    const promises = [];
    draftMatches.forEach((body) => {
      const { draftMatchId } = body;
      delete body.draftMatchId;
      delete body.createdAt;
      promises.push(API.post("atl-backend", "create/match", { body }));
      promises.push(API.del("atl-backend", `delete/draftMatch/${draftMatchId}`));
    });
    await Promise.all(promises);
    const updatedMatches = await API.get("atl-backend", "list/match");
    setAdding(false);
    setAllMatches([...updatedMatches]);
    setDraftMatches([]);
    setDraftView(false);
  };

  const clearSchedule = async () => {
    setClearing(true);
    await API.post("atl-backend", "clearSchedule");
    setAllMatches([]);
    setMatches([]);
    setMatchResults([]);
    setStandings([]);
    setClearing(false);
    setModalVisible(false);
  };

  const getExportValue = (team, key) => {
    if (key === "teamId") return teamsById[team.teamId].teamName;
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

  const standingsColumns = {
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

  const downloadStandingsExcel = () => {
    const headerRow = Object.keys(standingsColumns).map((key) => ({ value: standingsColumns[key].label, type: "string" }));
    const dataRows = sortedStandings.map((team) => Object.keys(standingsColumns).map((key) => ({
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

  const generateSchedulePDF = async () => {
    const blob = await pdf(
      <SchedulePDF
        dataKeys={dataKeys}
        columns={columns}
        filterMatches={filterMatches}
        allMatches={draftView ? draftMatches : allMatches}
        getValue={getValue}
        primaryKey={draftView ? "draftMatchId" : "matchId"}
      />
    ).toBlob();
    saveAs(blob, 'ATL Match Schedule.pdf');
  };

  const generateStandingsPDF = async () => {
    const blob = await pdf(
      <StandingsPDF
        columns={standingsColumns}
        standings={sortedStandings}
        getValue={getExportValue}
      />
    ).toBlob();
    saveAs(blob, `ATL Standings - ${currentSeason.seasonName}.pdf`);
  };

  const generatePlayerResultsPDF = async () => {
    const blob = await pdf(
      <PlayerResultsPDF columns={playerColumns} playerResults={playerResults} />
    ).toBlob();
    saveAs(blob, `ATL Player Results - ${currentSeason.seasonName}.pdf`);
  };

  const onExcelUploaded = (event) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      console.log(json);
      let matches = [];
      let validationErrors = [];
      let weekNumber = 0;
      let matchDate;
      for (const row of json) {
        if (row.date && /[a-zA-Z]/.test(row.date)) {
          weekNumber++;
          matchDate = moment(row.date, 'D-MMM').format('YYYY-MM-DD');
        }
        const matchTime = row.time;
        const cells = Object.entries(row).filter(([key]) => !['date', 'time'].includes(key));
        for (const cell of cells) {
          let cellValidationErrors = [];
          const matchDetails = {};
          const [locationName, teams] = cell;
          const location = locations.find((location) => (
            location.locationName.toLowerCase().includes(locationName.trim().toLowerCase())
          ));
          if (location) {
            matchDetails.locationId = location.locationId;
          } else {
            cellValidationErrors.push(`Location "${locationName}" not found - ensure name exactly matches what's on Locations page`);
          }
          const regexMatch = teams.trim().match(/^(\d{3})\s+(.+)$/);
          if (regexMatch) {
            matchDetails.matchNumber = parseInt(regexMatch[1]);
            const division = divisions.find((division) => division.divisionNumber === regexMatch[1][0]);
            if (division) {
              matchDetails.divisionId = division.divisionId;
            } else {
              cellValidationErrors.push(`First digit of match # ${matchDetails.matchNumber} does not correspond to a division`);
            }
            if (matches.find((match) => match.matchNumber === matchDetails.matchNumber)) {
              cellValidationErrors.push(`Match # ${matchDetails.matchNumber} appears twice in spreadsheet`);
            }
            if (draftMatches.find((match) => match.matchNumber === matchDetails.matchNumber)) {
              cellValidationErrors.push(`Match # ${matchDetails.matchNumber} already in use by existing draft match`);
            }
            const teamNames = regexMatch[2].trim();
            console.log(teamNames);
            // TODO make sure home team != visiting team
          } else {
            cellValidationErrors.push(`Match # missing for "${teams}"`);
          }
          if (cellValidationErrors.length > 0) {
            validationErrors.push(...cellValidationErrors);
          } else {
            matches.push({
              weekNumber,
              matchDate,
              // startTime, // TODO use value after 2nd team name if defined, otherwise matchTime if defined, otherwise validation error ("Match time missing for ...")
              // homeTeamId, // TODO use team name before @ in teamNames; if no @, validation error ("@ missing from ...")
              // visitorTeamId, // TODO use team name after @ in teamNames; if no @, validation error ("@ missing from ...")
              ...matchDetails // matchNumber, divisionId, locationId
            })
          }
        }
      }
      validationErrors = uniq(validationErrors);
      console.log(validationErrors);
      // TODO if validation errors, show them in alert; otherwise, create draft matches
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  };

  return (
    <div className="container">
      <PageHeader>Matches</PageHeader>
      <div className="centered-text season-toggle">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={() => setDraftView(!draftView)}>
          {draftView && <><i className="fas fa-arrow-left" />{' '}</>}
          {`View ${draftView ? 'published' : 'unpublished'} matches`}
          {!draftView && <>{' '}<i className="fas fa-arrow-right" /></>}
        </a>
      </div>
      <form>
        <FormGroup controlId="locationId">
          <FormControl
            value={locationId || ''}
            componentClass="select"
            onChange={e => setLocationId(e.target.value)}
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>{location.locationName}</option>
            ))}
          </FormControl>
        </FormGroup>
      </form>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
          <Table
            columns={columns}
            rows={draftView ? draftMatches : matches}
            filterRows={filterMatches}
            setRows={draftView ? setDraftMatches : setAllMatches}
            getRows={() => API.get("atl-backend", `list/${draftView ? 'draftMatch' : 'match'}`)}
            itemType="match"
            primaryKey={draftView ? "draftMatchId" : undefined}
            API={API}
            validate={validate}
            customAddFunction={addMatch}
            customEditFunction={editMatch}
            customRemoveFunction={deleteMatch}
          />
          {draftView && (
            <div className="file-upload-wrapper">
              <b>Import matches from Excel:</b>
              <input type="file" accept=".xlsx" onChange={onExcelUploaded} />
            </div>
          )}
          <p className="centered-text">
            <b>Download schedule:</b>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" onClick={downloadExcel} className="download-schedule-link">
              <i className="fas fa-file-excel" />
              Excel
            </a>
            <span className="download-schedule-link" onClick={generateSchedulePDF}>
              <i className="fas fa-file-pdf" />
              PDF
            </span>
          </p>
          {!draftView && (
            <p className="centered-text">
              <b>Download standings:</b>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={downloadStandingsExcel} className="download-schedule-link">
                <i className="fas fa-file-excel" />
                Excel
              </a>
              <span className="download-schedule-link" onClick={generateStandingsPDF}>
                <i className="fas fa-file-pdf" />
                PDF
              </span>
            </p>
          )}
          {!draftView ? (
            <>
              {!loadingPlayerResults && (
                <>
                  <p className="centered-text">
                    <b>Download player results:</b>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a onClick={downloadPlayersExcel} className="download-schedule-link">
                      <i className="fas fa-file-excel" />
                      Excel
                    </a>
                    <span className="download-schedule-link" onClick={generatePlayerResultsPDF}>
                      <i className="fas fa-file-pdf" />
                      PDF
                    </span>
                  </p>
                </>
              )}
              <div className="centered-content clear-matches">
                <LoaderButton
                  bsSize="large"
                  bsStyle="primary"
                  onClick={() => setModalVisible(true)}
                  className="publish-schedule-btn"
                >
                  Clear Matches
                </LoaderButton>
              </div>
              <p className="centered-text clear-matches-note">
                <b>NOTE:</b> You will be given the chance to confirm after clicking this button.
              </p>
            </>
          ) : (
            <>
              <div className="centered-content publish-matches">
                <LoaderButton
                  bsSize="large"
                  bsStyle="primary"
                  onClick={addToSchedule}
                  isLoading={adding}
                  className="publish-schedule-btn"
                >
                  Publish Matches
                </LoaderButton>
              </div>
              <p className="centered-text publish-matches-note">
                <b>NOTE:</b> Be sure to clear all matches from the previous season before publishing matches for the new season.
              </p>
            </>
          )}
        </>
      )}
      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <h2>Clear Matches</h2>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete all matches, scores, and standings currently live on the website?</p>
          <p>Be sure that you've downloaded copies of the current season's results for your records before proceeding.</p>
          <FormGroup>
            <LoaderButton
              block
              bsSize="large"
              bsStyle="primary"
              isLoading={clearing}
              onClick={clearSchedule}
            >
              Yes, clear matches
            </LoaderButton>
          </FormGroup>
          <FormGroup>
            <LoaderButton
              block
              bsSize="large"
              onClick={() => setModalVisible(false)}
              className="cancel-button"
            >
              Cancel
            </LoaderButton>
          </FormGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
}
