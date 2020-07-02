import React, { useState } from "react";
import { PageHeader, FormControl, Modal } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";
import ConfirmationModal from "./ConfirmationModal";

export default () => {
  const { allPlayers, setAllPlayers, team } = useAppContext();
  const [dropdownOptionSelected, setDropdownOptionSelected] = useState("");
  const [playerIdToAdd, setPlayerIdToAdd] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

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
  const playersOnTeam = allPlayers.filter((player) => player.teamId === teamId);
  const playersNotOnTeam = allPlayers.filter((player) => player.teamId !== teamId);
  const playersOnDifferentTeam = playersNotOnTeam.filter((player) => player.teamId);
  const playersNotOnAnyTeam = playersNotOnTeam.filter((player) => !player.teamId);

  const addPlayerToTeam = async (event) => {
    const playerId = event.target.value;
    setDropdownOptionSelected(playerId);
    const index = allPlayers.findIndex((rowInList) => rowInList.playerId === playerId);
    const player = allPlayers[index];
    if (player.teamId) {
      setPlayerIdToAdd(player.playerId);
    } else {
      const body = { ...player, teamId }
      const result = await API.put("atl-backend", `update/player/${playerId}`, { body });
      allPlayers[index] = result;
      setAllPlayers([...allPlayers]);
      setDropdownOptionSelected("");
    }
  };

  const addPlayerFromOtherTeam = async () => {
    setIsLoading(true);
    const index = allPlayers.findIndex((rowInList) => rowInList.playerId === playerIdToAdd);
    const player = allPlayers[index];
    const body = { ...player, teamId }
    const result = await API.put("atl-backend", `update/player/${playerIdToAdd}`, { body });
    allPlayers[index] = result;
    setAllPlayers([...allPlayers]);
    setDropdownOptionSelected("");
    setPlayerIdToAdd(undefined);
    setIsLoading(false);
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
        {playersNotOnAnyTeam.length > 0 && (
          <React.Fragment>
            <option value="note" disabled>Players not yet on a team:</option>
            {playersNotOnAnyTeam.map((player) => (
              <option key={player.playerId} value={player.playerId}>
                {`${player.firstName} ${player.lastName}`}
              </option>
            ))}
          </React.Fragment>
        )}
        {playersOnDifferentTeam.length > 0 && (
          <React.Fragment>
            <option value="note2" disabled>Players already on a team:</option>
            {playersOnDifferentTeam.map((player) => (
              <option key={player.playerId} value={player.playerId}>
                {`${player.firstName} ${player.lastName}`}
              </option>
            ))}
          </React.Fragment>
        )}
      </FormControl>
    </td>
  );

  return (
    <div>
      <PageHeader>Team Roster</PageHeader>
      {allPlayers.length > 0 && (
        <Table
          columns={columns}
          rows={playersOnTeam}
          setRows={setAllPlayers}
          itemType="player"
          API={API}
          CustomAddComponent={AddPlayerComponent}
          customRemoveFunction={removePlayerFromTeam}
          categoryName="team"
        />
      )}
      <ConfirmationModal
        playerIdToAdd={playerIdToAdd}
        setPlayerIdToAdd={setPlayerIdToAdd}
        isLoading={isLoading}
        addPlayerFromOtherTeam={addPlayerFromOtherTeam}
        setDropdownOptionSelected={setDropdownOptionSelected}
      />
    </div>
  );
}
