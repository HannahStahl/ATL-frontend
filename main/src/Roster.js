import React, { useState } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";
import AddPlayerModal from "./AddPlayerModal";

export default () => {
  const { allPlayers, setAllPlayers, team, loadingData } = useAppContext();
  const [addingPlayer, setAddingPlayer] = useState(false);

  const columns = {
    "name": {
      label: "Name",
      children: [
        { key: "firstName", label: "First Name", type: "text", required: true },
        { key: "lastName", label: "Last Name", type: "text", required: true },
      ]
    },
    "phone": { label: "Phone", type: "text", placeholder: "xxx-xxx-xxxx" },
    "email": { label: "Email", type: "email", required: true },
    "rating": { label: "Rating", type: "number", required: true },
    "ratingType": {
      label: "Rating Type",
      type: "dropdown",
      options: [{ value: "U", name: "USTA Rating" }, { value: "S", name: "Self Rating" }]
    },
    "gender": {
      label: "Gender",
      type: "dropdown",
      required: true,
      options: [{ value: "F", name: "Female" }, {value: "M", name: "Male" }],
    },
    "birthYear": { label: "Birth Year", type: "number", required: true },
    "usta": {
      label: "USTA?",
      type: "dropdown",
      options: [{ value: "Y", name: "Yes" }, { value: "N", name: "No" }]
    },
    "ustaLevel": { label: "USTA Level", type: "text" },
    "ustaYear": { label: "USTA Year", type: "number" },
    "experience": { label: "Experience", type: "textarea" },
    "comments": { label: "Comments", type: "textarea" },
  };

  const { teamId } = team;

  const removePlayerFromTeam = async (playerId) => {
    const index = allPlayers.findIndex((player) => player.playerId === playerId);
    const body = allPlayers[index];
    body.teamId = undefined;
    await API.put("atl-backend", `update/player/${playerId}`, { body });
    const newAllPlayers = await API.get("atl-backend", "list/player");
    setAllPlayers([...newAllPlayers]);
  };

  const AddPlayerComponent = () => (
    <td
      colSpan={Object.keys(columns).filter((key) => !columns[key].hideFromTable).length + 1}
      onClick={() => setAddingPlayer(true)}
    >
      + Add new player
    </td>
  );

  const filterPlayers = (list) => list.filter((player) => player.teamId === teamId);

  return (
    <div>
      <PageHeader>Team Roster</PageHeader>
      {!loadingData && (
        <Table
          columns={columns}
          rows={allPlayers}
          filterRows={filterPlayers}
          setRows={setAllPlayers}
          getRows={() => API.get("atl-backend", "list/player")}
          itemType="player"
          API={API}
          CustomAddComponent={AddPlayerComponent}
          customRemoveFunction={removePlayerFromTeam}
          categoryName="team"
        />
      )}
      <AddPlayerModal
        columns={columns}
        allPlayers={allPlayers}
        setAllPlayers={setAllPlayers}
        teamId={teamId}
        addingPlayer={addingPlayer}
        setAddingPlayer={setAddingPlayer}
      />
    </div>
  );
}
