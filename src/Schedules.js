import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader, FormGroup, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import zipcelx from "zipcelx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import SchedulePDF from "./SchedulePDF";
import LoaderButton from "./LoaderButton";

export default () => {
  const {
    allMatches, setAllMatches, draftMatches, setDraftMatches, divisions,
    matchResults, setMatchResults, locations, allTeams, seasons, loadingData
  } = useAppContext();
  const [locationId, setLocationId] = useState("");
  const [allPlayers, setAllPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [draftView, setDraftView] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const currentSeason = seasons.find((season) => draftView ? !season.currentSeason : season.currentSeason);
  const seasonName = currentSeason ? currentSeason.seasonName : "";

  useEffect(() => {
    if (!loadingData && allMatches.length > 0) {
      const matches = allMatches.map((match) => {
        const matchResult = matchResults.find((result) => result.matchId === match.matchId);
        return { ...match, ...matchResult };
      });
      setMatches(matches);
    }
  }, [loadingData, allMatches, matchResults]);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

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
    weekNumber: { label: "Week", type: "number", required: true },
    matchNumber: { label: "Match #", type: "number", required: true },
    divisionId: {
      label: "Division",
      type: "dropdown",
      joiningTable: divisions,
      joiningTableKey: "divisionId",
      joiningTableFieldNames: ["divisionNumber"]
    },
    matchDate: { label: "Date", type: "date", render: (value) => value && moment(value).format("M/D/YYYY") },
    startTime: { label: "Time", type: "text" },
    locationId: {
      label: "Location",
      type: "dropdown",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
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
      visitorSetsForfeited: { label: "Visitor Sets Forfeited", type: "number" }
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
      const [updatedMatches, updatedMatchResults] = await Promise.all([
        API.get("atl-backend", "list/match"),
        API.get("atl-backend", "list/matchResult")
      ]);
      setAllMatches([...updatedMatches]);
      setMatchResults([...updatedMatchResults]);
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
      if (matchResults.find((matchResult) => matchResult.matchId === body.matchId)) {
        promises.push(API.put("atl-backend", `update/matchResult/${matchId}`, { body }));
      } else {
        promises.push(API.post("atl-backend", "create/matchResult", { body }));
      }
      await Promise.all(promises);
      const [updatedMatches, updatedMatchResults] = await Promise.all([
        API.get("atl-backend", "list/match"),
        API.get("atl-backend", "list/matchResult")
      ]);
      setAllMatches([...updatedMatches]);
      setMatchResults([...updatedMatchResults]);
    }
  };

  const deleteMatch = async (matchId) => {
    if (draftView) {
      await API.del("atl-backend", `delete/draftMatch/${matchId}`);
      const updatedMatches = await API.get("atl-backend", "list/draftMatch");
      setDraftMatches([...updatedMatches]);
    } else {
      const promises = [API.del("atl-backend", `delete/match/${matchId}`)];
      if (matchResults.find((matchResult) => matchResult.matchId === matchId)) {
        promises.push(API.del("atl-backend", `delete/matchResult/${matchId}`));
      }
      await Promise.all(promises);
      const [updatedMatches, updatedMatchResults] = await Promise.all([
        API.get("atl-backend", "list/match"),
        API.get("atl-backend", "list/matchResult")
      ]);
      setAllMatches([...updatedMatches]);
      setMatchResults([...updatedMatchResults]);
    }
  }

  const dataKeys = ["matchNumber", "weekNumber", "matchDate", "startTime", "locationId", "homeTeamId", "visitorTeamId"];

  const getValue = (match, key) => {
    let value = match[key] || "";
    if (key === "locationId" && value.length > 0) {
      const location = locations.find((locationInList) => locationInList.locationId === value);
      value = location ? (location.locationName || "") : "";
    } else if ((key === "homeTeamId" || key === "visitorTeamId") && value && value.length > 0) {
      const team = allTeams.find((teamInList) => teamInList.teamId === value);
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

  const publishSchedule = async () => {
    setPublishing(true);
    await API.post("atl-backend", "publishSchedule");
    const updatedMatches = await API.get("atl-backend", "list/match");
    setPublishing(false);
    setAllMatches([...updatedMatches]);
    setDraftMatches([]);
    setMatchResults([]);
    setDraftView(false);
  };

  return (
    <div className="container">
      <PageHeader>Matches</PageHeader>
      <div className="centered-text season-toggle">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" onClick={() => setDraftView(!draftView)}>
          {`View ${draftView ? 'current' : 'next'} season's schedule`}
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
          <p className="centered-text">
            <b>Download schedule:</b>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" onClick={downloadExcel} className="download-schedule-link">
              <i className="fas fa-file-excel" />
              Excel
            </a>
            <span className="download-schedule-link">
              <PDFDownloadLink
                key={Math.random()}
                document={
                  <SchedulePDF
                    title={`${seasonName} Austin Tennis League`}
                    dataKeys={dataKeys}
                    columns={columns}
                    filterMatches={filterMatches}
                    allMatches={draftView ? draftMatches : allMatches}
                    getValue={getValue}
                    primaryKey={draftView ? "draftMatchId" : "matchId"}
                  />
                }
                fileName="ATL Match Schedule.pdf"
              >
                <i className="fas fa-file-pdf" />
                PDF
              </PDFDownloadLink>
            </span>
          </p>
          {draftView && (
            <>
              <div className="centered-content">
                <LoaderButton
                  bsSize="large"
                  bsStyle="primary"
                  onClick={publishSchedule}
                  isLoading={publishing}
                  className="publish-schedule-btn"
                >
                  Publish Schedule
                </LoaderButton>
              </div>
              <p className="centered-text">
                <b>NOTE:</b> Publishing this schedule will replace the website's match schedule with this one.
                So if you would like to download a copy of the current season's match results,
                be sure to do so on <a href="/update-standings">the Standings page</a> before publishing.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}
