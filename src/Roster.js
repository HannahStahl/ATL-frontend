import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import AddPlayerModal from "./AddPlayerModal";

export default ({ team }) => {
  const { loadingData } = useAppContext();
  const [allPlayers, setAllPlayers] = useState([]);
  const [addingPlayer, setAddingPlayer] = useState(false);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

  const columns = {
    "playerNumber": {
      label: "Number",
      readOnly: true
    },
    "name": {
      label: "Name",
      children: [
        { key: "firstName", label: "First Name", type: "text", required: true },
        { key: "lastName", label: "Last Name", type: "text", required: true },
      ]
    },
    "phone": { label: "Phone", type: "text", placeholder: "xxx-xxx-xxxx" },
    "email": { label: "Email", type: "email" },
    "rating": { label: "Rating", type: "number", render: (rating) => rating ? parseFloat(rating).toFixed(1) : "" },
    "ratingType": {
      label: "Rating Type",
      type: "dropdown",
      options: [{ value: "U", name: "USTA Rating" }, { value: "S", name: "Self Rating" }]
    },
    "gender": {
      label: "Gender",
      type: "dropdown",
      options: [{ value: "F", name: "Female" }, {value: "M", name: "Male" }],
    },
    "birthYear": { label: "Birth Year", type: "number" },
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
    allPlayers[index].teamId = undefined;
    await API.put("atl-backend", `update/player/${playerId}`, { body: allPlayers[index] });
    await API.post("atl-backend", `deactivatePlayer/${playerId}`);
    allPlayers.splice(index, 1);
    setAllPlayers([...allPlayers]);
  };

  const AddPlayerComponent = () => (
    <td
      colSpan={Object.keys(columns).filter((key) => !columns[key].hideFromTable).length + 1}
      onClick={() => setAddingPlayer(true)}
    >
      + Add a player
    </td>
  );

  const filterPlayers = (list) => list.filter((player) => player.teamId === teamId);

  return !loadingData && teamId ? (
    <>
      <hr className="team-details-page-break" />
      <h1 className="team-details-page-header">Roster</h1>
      <Table
        columns={columns}
        rows={allPlayers}
        filterRows={filterPlayers}
        setRows={setAllPlayers}
        getRows={() => API.get("atl-backend", "/list/player")}
        itemType="player"
        API={API}
        CustomAddComponent={AddPlayerComponent}
        customRemoveFunction={removePlayerFromTeam}
        categoryName="team"
      />
      <div className="centered-content">
        <a href="/players-looking">View list of players looking for a team</a>
      </div>
      <AddPlayerModal
        columns={columns}
        allPlayers={allPlayers}
        setAllPlayers={setAllPlayers}
        teamId={teamId}
        addingPlayer={addingPlayer}
        setAddingPlayer={setAddingPlayer}
      />
    </>
  ) : <div />;
}
