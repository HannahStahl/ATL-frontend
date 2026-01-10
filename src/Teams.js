import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { saveAs } from "file-saver";
import zipcelx from "zipcelx";
import { pdf } from "@react-pdf/renderer";
import Table from "./Table";
import TeamsPDF from "./TeamsPDF";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default () => {
  const {
    allTeams, setAllTeams, allCaptains, divisions, locations, loadingData,
  } = useAppContext();
  const [teams, setTeams] = useState([]);
  
  useEffect(() => {
    if (
      !loadingData &&
      allCaptains.length > 0 &&
      allTeams.length > 0
    ) {
      const captainsById = {};
      allCaptains.forEach((captain) => {
        captainsById[captain.userId] = captain;
      });
      const teams = allTeams.map((team) => {
        const captain = captainsById[team.captainId];
        const cocaptain = captainsById[team.cocaptainId];
        const captainEmail = captain && captain.email;
        const cocaptainEmail = cocaptain && cocaptain.email;
        return { ...team, captainEmail, cocaptainEmail };
      });
      setTeams(teams);
    }
  }, [loadingData, allTeams, allCaptains]);

  const columns = {
    teamNumber: { label: "Team #", type: "number" },
    isRegistered: {
      label: "Registered",
      type: "checkbox",
      render: (value) => value ? <i className="fas fa-check" /> : ""
    },
    teamName: { label: "Team Name", type: "text", required: true },
    captainId: {
      label: "Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"]
    },
    captainEmail: {
      label: "Captain Email",
      readOnly: true
    },
    cocaptainId: {
      label: "Co-Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"]
    },
    cocaptainEmail: {
      label: "Co-Captain Email",
      readOnly: true
    },
    divisionId: {
      label: "Division",
      type: "dropdown",
      joiningTable: divisions,
      joiningTableKey: "divisionId",
      joiningTableFieldNames: ["divisionNumber"]
    },
    locationId: {
      label: "Home Courts",
      type: "dropdown",
      joiningTable: locations,
      joiningTableKey: "locationId",
      joiningTableFieldNames: ["locationName"]
    },
    courtNumber: { label: "# of Courts", type: "number" },
    courtTime: { label: "Preferred Time", type: "text" },
    isActive: {
      label: "Active",
      type: "checkbox",
      render: (value) => value ? <i className="fas fa-check" /> : ""
    },
    comments: { label: "Comments", type: "textarea" }
  };

  const emailCaptain = async (captainId, teamName, url, captainOrCocaptain) => {
    const captain = allCaptains.find((captainInList) => captainInList.userId === captainId);
    const { firstName, email: captainEmail } = captain;
    await API.post("atl-backend", "emailCaptain", {
      body: { firstName, teamName, captainOrCocaptain, url, captainEmail }
    });
  };

  const createTeam = async (body) => {
    await API.post("atl-backend", "create/team", { body });
    const updatedTeams = await API.get("atl-backend", "list/team");
    const { captainId, cocaptainId, teamName } = body;
    const url = window.location.origin;
    const promises = [];
    if (captainId && captainId.length > 0) {
      promises.push(emailCaptain(captainId, teamName, url, "captain"));
    }
    if (cocaptainId && cocaptainId.length > 0) {
      promises.push(emailCaptain(cocaptainId, teamName, url, "co-captain"));
    }
    await Promise.all(promises);
    setAllTeams([...updatedTeams]);
  };

  const editTeam = async (teamId, body) => {
    const original = await API.get("atl-backend", `get/team/${teamId}`);
    await API.put("atl-backend", `update/team/${teamId}`, { body });
    const updatedTeams = await API.get("atl-backend", "list/team");
    const { captainId, cocaptainId, teamName } = body;
    const url = window.location.origin;
    const promises = [];
    if (captainId && captainId.length > 0 && captainId !== original.captainId) {
      promises.push(emailCaptain(captainId, teamName, url, "captain"));
    }
    if (cocaptainId && cocaptainId.length > 0 && cocaptainId !== original.cocaptainId) {
      promises.push(emailCaptain(cocaptainId, teamName, url, "co-captain"));
    }
    await Promise.all(promises);
    setAllTeams([...updatedTeams]);
  };

  const validate = (body) => {
    const { teamId, teamNumber, isActive } = body;
    if (isActive && (!teamNumber || teamNumber.length === 0)) {
      onError("Must provide team number.");
      return false;
    }
    const otherTeamNumbers = allTeams.filter((team) => team.teamId !== teamId).map((team) => team.teamNumber);
    if (teamNumber && teamNumber.length > 0 && otherTeamNumbers.indexOf(teamNumber) > -1 ) {
      onError("Team number must be unique.");
      return false;
    }
    return true;
  };

  const filterTeams = (list) => list.filter((team) => team.isActive);

  const dataKeys = ["teamNumber", "teamName", "captainId", "cocaptainId", "divisionId", "locationId", "courtTime"];

  const getValue = (team, key) => {
    let value = team[key] || "";
    if ((key === "captainId" || key === "cocaptainId") && value.length > 0) {
      const captain = allCaptains.find((captainInList) => captainInList.userId === value);
      value = captain ? `${captain.firstName || ""} ${captain.lastName || ""}` : "";
    } else if (key === "divisionId" && value.length > 0) {
      const division = divisions.find((divisionInList) => divisionInList.divisionId === value);
      value = division ? (division.divisionNumber || "") : "";
    } else if (key === "locationId" && value.length > 0) {
      const location = locations.find((locationInList) => locationInList.locationId === value);
      value = location ? (location.locationName || "") : "";
    }
    return value;
  };

  const downloadExcel = () => {
    const activeTeams = filterTeams(teams);
    const headerRow = dataKeys.map((key) => ({
      value: columns[key].label, type: "string"
    }));
    const dataRows = activeTeams.map((team) => dataKeys.map((key) => {
      return ({ value: getValue(team, key), type: "string" });
    }));
    const data = [headerRow].concat(dataRows);
    zipcelx({
      filename: "ATL - Active Teams",
      sheet: { data }
    });
  };

  const generatePDF = async () => {
    const blob = await pdf(
      <TeamsPDF
        columns={columns}
        exportFields={dataKeys}
        teams={filterTeams(teams)}
        getValue={getValue}
      />
    ).toBlob();
    saveAs(blob, 'ATL - Active Teams.pdf');
  };

  return (
    <div className="container">
      <PageHeader>Teams</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
          <Table
            columns={columns}
            rows={teams}
            filterRows={filterTeams}
            getInactiveRows={(list) => list.filter((row) => !row.isActive)}
            setRows={setAllTeams}
            getRows={() => API.get("atl-backend", "list/team")}
            itemType="team"
            API={API}
            customAddFunction={createTeam}
            customEditFunction={editTeam}
            validate={validate}
          />
        </>
      )}
      <p className="centered-text">
        <b>Download list of active teams:</b>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a onClick={downloadExcel} className="download-schedule-link">
          <i className="fas fa-file-excel" />
          Excel
        </a>
        <span className="download-schedule-link" onClick={generatePDF}>
          <i className="fas fa-file-pdf" />
          PDF
        </span>
      </p>
    </div>
  );
}
