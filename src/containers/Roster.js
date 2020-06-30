import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import Table from "../components/Table";

export default () => {
  const { allPlayers, setAllPlayers, team } = useAppContext();

  const columns = {
    firstName: { label: "First Name", type: "text", required: true },
    lastName: { label: "Last Name", type: "text", required: true },
    "phone": { label: "Phone", type: "text" },
    "email": { label: "Email", type: "email", required: true },
    "rating": { label: "Rating", type: "number", required: true },
    "selfRated": { label: "Self-Rated?", type: "text" }, // TODO make this a checkbox
    "gender": { label: "Gender", type: "text", required: true },
    "birthYear": { label: "Birth Year", type: "number", required: true },
    "usta": { label: "USTA?", type: "text" }, // TODO make this a checkbox
    "ustaLevel": { label: "USTA Level", type: "text" },
    "ustaYear": { label: "USTA Year", type: "number" },
    "experience": { label: "Experience", type: "textarea" },
    "comments": { label: "Comments", type: "textarea" },
  };

  const { teamId } = team;
  const playersOnTeam = teamId
    ? allPlayers.filter((player) => player.teamId === teamId)
    : [];

  return (
    <div>
      <PageHeader>Team Roster</PageHeader>
      {playersOnTeam.length > 0 && (
        <Table
          columns={columns}
          rows={playersOnTeam}
          setRows={setAllPlayers}
          itemType="player"
        />
      )}
    </div>
  );
}
