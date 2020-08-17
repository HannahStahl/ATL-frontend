import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default ({ team }) => {
  const {
    allMatches, setAllMatches, matchResults, setMatchResults, allCaptains, locations, allTeams, loadingData
  } = useAppContext();
  const [matches, setMatches] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedCaptain, setSelectedCaptain] = useState(undefined);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

  useEffect(() => {
    if (
      !loadingData &&
      allMatches.length > 0 &&
      matchResults.length > 0 &&
      allCaptains.length > 0 &&
      allTeams.length > 0
    ) {
      const matches = allMatches.map((match) => {
        const homeTeam = allTeams.find((team) => team.teamId === match.homeTeamId);
        const visitorTeam = allTeams.find((team) => team.teamId === match.visitorTeamId);
        const matchResult = matchResults.find((result) => result.matchId === match.matchId);
        const homeCaptainId = homeTeam.captainId;
        const visitorCaptainId = visitorTeam.captainId;
        return { ...match, ...matchResult, homeCaptainId, visitorCaptainId };
      });
      setMatches(matches);
    }
  }, [loadingData, allTeams, allMatches, matchResults, allCaptains])

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

  const columns = {
    weekNumber: { label: "Week", readOnly: true },
    matchDate: {
      label: "Date",
      type: "date",
      readOnly: true,
      render: (value) => value && moment(value).format("M/D/YYYY")
    },
    startTime: { label: "Time", readOnly: true },
    locationId: {
      label: "Location",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"],
      readOnly: true
    },
    homeTeamId: {
      label: "Home Team",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
      readOnly: true
    },
    homeCaptainId: {
      label: "Home Captain",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"],
      readOnly: true,
      render: (value, row) => (
        row.homeCaptainId && row.homeCaptainId.length > 0 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            href="#"
            onClick={() => setSelectedCaptain(allCaptains.find((captain) => captain.userId === row.homeCaptainId))}
          >
            {value}
          </a>
        )
      )
    },
    visitorTeamId: {
      label: "Visiting Team",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
      readOnly: true
    }, // TODO change these to Home boolean and Opponent name
    visitorCaptainId: {
      label: "Visitor Captain",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"],
      readOnly: true,
      render: (value, row) => (
        row.visitorCaptainId && row.visitorCaptainId.length > 0 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            href="#"
            onClick={() => setSelectedCaptain(allCaptains.find((captain) => captain.userId === row.visitorCaptainId))}
          >
            {value}
          </a>
        )
      )
    },
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
  };

  const { teamId } = team;

  const filterMatches = (list) => list.filter(
    (match) => match.homeTeamId === teamId || match.visitorTeamId === teamId
  );

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

  const editMatch = async (matchId, body) => {
    body.totalHomeSetsWon = getTotalHomeSetsWon(body);
    body.totalVisitorSetsWon = getTotalVisitorSetsWon(body);
    if (matchResults.find((matchResult) => matchResult.matchId === body.matchId)) {
      await API.put("atl-backend", `update/matchResult/${matchId}`, { body });
    } else {
      await API.post("atl-backend", "create/matchResult", { body });
    }
    const updatedMatchResults = await API.get("atl-backend", "list/matchResult");
    setMatchResults([...updatedMatchResults]);
  };

  return !loadingData && teamId ? (
    <>
      <hr className="team-details-page-break" />
      <h1 className="team-details-page-header">Matches</h1>
      <Table
        columns={columns}
        rows={matches}
        filterRows={filterMatches}
        setRows={setAllMatches}
        getRows={() => API.get("atl-backend", "list/match")}
        itemType="match"
        API={API}
        customEditFunction={editMatch}
        createDisabled
        removeDisabled
      />
      <Modal show={selectedCaptain !== undefined} onHide={() => setSelectedCaptain(undefined)}>
        <Modal.Header closeButton>
          <h2>{selectedCaptain ? `${selectedCaptain.firstName || ""} ${selectedCaptain.lastName || ""}` : ""}</h2>
        </Modal.Header>
        <Modal.Body>
            <p><b>Phone:</b> {selectedCaptain ? (selectedCaptain.phone || "") : ""}</p>
            <p><b>Email:</b> {selectedCaptain ? (selectedCaptain.email || "") : ""}</p>
        </Modal.Body>
      </Modal>
    </>
  ) : <div />;
}
