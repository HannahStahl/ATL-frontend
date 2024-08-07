import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

export default () => {
  const {
    allTeams, setAllTeams, allCaptains, divisions, locations, loadingData,
  } = useAppContext();

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
    cocaptainId: {
      label: "Co-Captain",
      type: "dropdown",
      joiningTable: allCaptains,
      joiningTableKey: "userId",
      joiningTableFieldNames: ["firstName", "lastName"]
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

  return (
    <div className="container">
      <PageHeader>Teams</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
          <Table
            columns={columns}
            rows={allTeams}
            filterRows={(list) => list.filter((row) => row.isActive)}
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
    </div>
  );
}
