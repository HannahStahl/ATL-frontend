import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader, Table } from "react-bootstrap";
import { API } from "aws-amplify";
import { useAppContext } from "./libs/contextLib";

export default function MatchResult() {
  const { allMatches, matchResults, allTeams, locations } = useAppContext();
  const matchId = window.location.pathname.split('match-results/')[1];
  const [match, setMatch] = useState({});

  useEffect(() => {
    const getPlayer = async (matchInfo, homeOrAway, line, index) => {
      const playerId = matchInfo[`${line}${homeOrAway}Player${index || ""}Id`];
      if (playerId && playerId.length > 0) {
        const player = await API.get("atl-backend", `get/player/${playerId}`);
        return `${player.firstName || ""} ${player.lastName}`;
      }
      return "";
    };
    const getPlayers = async (matchInfo, homeOrAway, line) => {
      const [player1, player2] = await Promise.all([
        getPlayer(matchInfo, homeOrAway, line, 1),
        getPlayer(matchInfo, homeOrAway, line, 2)
      ]);
      return `${player1}${player1 && player2 ? ', ' : ''}${player2}`;
    };
    if (allMatches && allMatches.length > 0 && matchResults && matchResults.length > 0) {
      const getMatchInfo = async () => {
        const matchInfo = {
          ...allMatches.find((matchInList) => matchInList.matchId === matchId),
          ...matchResults.find((matchResultInList) => matchResultInList.matchId === matchId)
        };
        const [
          singles1HomePlayer, singles1VisitorPlayer,
          singles2HomePlayer, singles2VisitorPlayer,
          doubles1HomePlayers, doubles1VisitorPlayers,
          doubles2HomePlayers, doubles2VisitorPlayers
        ] = await Promise.all([
          getPlayer(matchInfo, "Home", "singles1"),
          getPlayer(matchInfo, "Visitor", "singles1"),
          getPlayer(matchInfo, "Home", "singles2"),
          getPlayer(matchInfo, "Visitor", "singles2"),
          getPlayers(matchInfo, "Home", "doubles1"),
          getPlayers(matchInfo, "Visitor", "doubles1"),
          getPlayers(matchInfo, "Home", "doubles2"),
          getPlayers(matchInfo, "Visitor", "doubles2")
        ]);
        setMatch({
          ...matchInfo,
          singles1HomePlayer, singles1VisitorPlayer,
          singles2HomePlayer, singles2VisitorPlayer,
          doubles1HomePlayers, doubles1VisitorPlayers,
          doubles2HomePlayers, doubles2VisitorPlayers
        });
      };
      if (matchId && matchId.length > 0) getMatchInfo();
    }
  }, [allMatches, matchResults, matchId]);

  if (!matchId || matchId.length === 0) {
    window.location.pathname = "/match-results";
    return <div className="container" />;
  }

  const getHomeTeam = () => {
    if (match.homeTeamId) {
      const homeTeam = allTeams.find((team) => team.teamId === match.homeTeamId);
      if (homeTeam) return homeTeam.teamName;
    }
    return undefined;
  };

  const getVisitorTeam = () => {
    if (match.visitorTeamId) {
      const visitorTeam = allTeams.find((team) => team.teamId === match.visitorTeamId);
      if (visitorTeam) return visitorTeam.teamName;
    }
    return undefined;
  };

  const getLocation = () => {
    if (match.locationId) {
      const location = locations.find((location) => location.locationId === match.locationId);
      if (location) return location.locationName;
    }
    return undefined;
  };

  return (
    <div className="container">
      <PageHeader>Match Results</PageHeader>
      <div className="centered-content">
        {match.matchId ? (
          <div className="centered-content-inner">
            <div className="centered-content match-result-intro">
              <div>
                <p><b>Match #:</b> {match.matchNumber || ""}</p>
                <p><b>Date:</b> {match.matchDate ? moment(match.matchDate).format("M/D/YYYY") : ""}</p>
                <p><b>Home:</b> {getHomeTeam()}</p>
                <p><b>Visitor:</b> {getVisitorTeam()}</p>
                <p><b>Location:</b> {getLocation()}</p>
                <p><b>Time:</b> {match.startTime || ""}</p>
              </div>
            </div>
            <div className="table-container">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Line</th>
                    <th>Home Player</th>
                    <th>Visitor Player</th>
                    <th>Score</th>
                    <th>Home Sets</th>
                    <th>Visitor Sets</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Singles 1</td>
                    <td>{match.singles1HomePlayer}</td>
                    <td>{match.singles1VisitorPlayer}</td>
                    <td>{match.singles1Score}</td>
                    <td>{match.singles1HomeSetsWon}</td>
                    <td>{match.singles1VisitorSetsWon}</td>
                  </tr>
                  <tr>
                    <td>Singles 2</td>
                    <td>{match.singles2HomePlayer}</td>
                    <td>{match.singles2VisitorPlayer}</td>
                    <td>{match.singles2Score}</td>
                    <td>{match.singles2HomeSetsWon}</td>
                    <td>{match.singles2VisitorSetsWon}</td>
                  </tr>
                  <tr>
                    <td>Doubles 1</td>
                    <td>{match.doubles1HomePlayers}</td>
                    <td>{match.doubles1VisitorPlayers}</td>
                    <td>{match.doubles1Score}</td>
                    <td>{match.doubles1HomeSetsWon}</td>
                    <td>{match.doubles1VisitorSetsWon}</td>
                  </tr>
                  <tr>
                    <td>Doubles 2</td>
                    <td>{match.doubles2HomePlayers}</td>
                    <td>{match.doubles2VisitorPlayers}</td>
                    <td>{match.doubles2Score}</td>
                    <td>{match.doubles2HomeSetsWon}</td>
                    <td>{match.doubles2VisitorSetsWon}</td>
                  </tr>
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td><b>{match.totalHomeSetsWon || 0}</b></td>
                    <td><b>{match.totalVisitorSetsWon || 0}</b></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}
