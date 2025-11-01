import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default () => {
  const { makeupMatches, setMakeupMatches, allCaptains, allTeams, loadingData } = useAppContext();
  const [makeups, setMakeups] = useState([]);
  const columns = {
    originalMatchNumber: {
      label: "Original Match #",
      type: "number",
    },
    homeTeamId: {
      label: "Home Team",
      type: "dropdown",
      required: true,
      joiningTable: allTeams.filter((team) => team.isActive && team.teamName !== "Bye"),
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
    },
    homeCaptainId: {
      label: "Home Captain",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"],
      readOnly: true,
    },
    visitorTeamId: {
      label: "Visiting Team",
      type: "dropdown",
      required: true,
      joiningTable: allTeams.filter((team) => team.isActive && team.teamName !== "Bye"),
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"],
    },
    visitorCaptainId: {
      label: "Visitor Captain",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"],
      readOnly: true,
    },
    matchDate: {
      label: "Date",
      type: "date",
      required: true,
      render: (value) => value && moment(value).format("M/D/YYYY"),
    },
    startTime: {
      label: "Time",
      type: "dropdown",
      options: [{ value: "9-11", name: "9-11" }, { value: "11-1", name: "11-1" }, { value: "1-3", name: "1-3" }, { value: "3-5", name: "3-5" }, { value: "5-7", name: "5-7" }],
      required: true,
    },
  };

  useEffect(() => {
    if (
      !loadingData &&
      makeupMatches.length > 0 &&
      allCaptains.length > 0 &&
      allTeams.length > 0
    ) {
      const teamsById = {};
      allTeams.forEach((team) => {
        teamsById[team.teamId] = team;
      });
      const makeups = makeupMatches.map((makeupMatch) => {
        const homeTeam = teamsById[makeupMatch.homeTeamId];
        const visitorTeam = teamsById[makeupMatch.visitorTeamId];
        const homeCaptainId = homeTeam && homeTeam.captainId;
        const visitorCaptainId = visitorTeam && visitorTeam.captainId;
        return { ...makeupMatch, homeCaptainId, visitorCaptainId };
      });
      setMakeups(makeups);
    }
  }, [loadingData, makeupMatches, allCaptains, allTeams]);

  
  const validate = (body) => {
    const { makeupMatchId, matchDate, startTime } = body;
    if (makeupMatches.find((match) => match.makeupMatchId !== makeupMatchId && match.matchDate === matchDate && match.startTime === startTime)) {
      onError("There is already another make-up match scheduled for this time.");
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <PageHeader>Make-Up Matches at Austin High School</PageHeader>
      <div className="centered-content">
        <p className="makeup-match-intro">This signup sheet is for make-up matches to be played at Austin High School.</p>
      </div>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <Table
          columns={columns}
          rows={makeups.sort((a, b) => {
            if (moment(a.matchDate).isBefore(b.matchDate)) return -1;
            if (moment(b.matchDate).isBefore(a.matchDate)) return 1;
            let hour1 = parseInt(a.startTime.split('-')[0]);
            let hour2 = parseInt(b.startTime.split('-')[0]);
            if (hour1 <= 6) hour1 += 12; // assume PM
            if (hour2 <= 6) hour2 += 12; // assume PM
            return hour1 - hour2;
          })}
          setRows={setMakeupMatches}
          getRows={() => API.get("atl-backend", "list/makeupMatch")}
          itemType="makeupMatch"
          displayType="make-up match"
          API={API}
          validate={validate}
        />
      )}
    </div>
  );
}
