import React, { useState } from "react";
import { PageHeader, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "../libs/contextLib";

export default () => {
  const { allPlayers, setAllPlayers, team } = useAppContext();
  const [dropdownOptionSelected, setDropdownOptionSelected] = useState("");

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

  const addPlayerToTeam = async (event) => {
    const playerId = event.target.value;
    setDropdownOptionSelected(playerId);
    const index = allPlayers.findIndex((rowInList) => rowInList.playerId === playerId);
    const player = allPlayers[index];
    const body = { ...player, teamId }
    const result = await API.put("atl-backend", `update/player/${playerId}`, { body });
    allPlayers[index] = result;
    setAllPlayers([...allPlayers]);
    setDropdownOptionSelected("");
  };

  const removePlayerFromTeam = async (playerId) => {
    const index = allPlayers.findIndex((player) => player.playerId === playerId);
    const body = allPlayers[index];
    body.teamId = undefined;
    const result = await API.put("atl-backend", `update/player/${playerId}`, { body });
    allPlayers[index] = result;
    setAllPlayers([...allPlayers]);
  };

  const AddPlayerComponent = () => (
    <td colSpan={Object.keys(columns).length + 1}>
      <FormControl
        componentClass="select"
        value={dropdownOptionSelected}
        onChange={addPlayerToTeam}
      >
        <option value="" disabled>{`+ Add new player to team`}</option>
        {allPlayers.filter((player) => player.teamId !== teamId).map((player) => (
          <option key={player.playerId} value={player.playerId}>
            {`${player.firstName} ${player.lastName}`}
          </option>
        ))}
      </FormControl>
    </td>
  );

  return (
    <div>
      <PageHeader>Team Roster</PageHeader>
      {allPlayers.length > 0 && (
        <Table
          columns={columns}
          rows={allPlayers.filter((player) => player.teamId === teamId)}
          setRows={setAllPlayers}
          itemType="player"
          API={API}
          CustomAddComponent={AddPlayerComponent}
          customRemoveFunction={removePlayerFromTeam}
          categoryName="team"
        />
      )}
    </div>
  );
}
