import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import AddPlayerModal from "./AddPlayerModal";

export default () => {
  const { team, loadingData } = useAppContext();
  const [allPlayers, setAllPlayers] = useState([]);
  const [addingPlayer, setAddingPlayer] = useState(false);

  useEffect(() => {
    API.get("atl-backend", "list/player").then(setAllPlayers);
  }, []);

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
    allPlayers[index].teamId = undefined;
    await API.put("atl-backend", `update/player/${playerId}`, { body: allPlayers[index] });
    setAllPlayers([...allPlayers]);
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
        teamId ? (
          <Table
            columns={columns}
            rows={allPlayers}
            filterRows={filterPlayers}
            setRows={setAllPlayers}
            getRows={(result) => {
              const index = allPlayers.findIndex((playerInList) => playerInList.playerId === result.playerId);
              allPlayers[index] = result;
              return allPlayers;
            }}
            itemType="player"
            API={API}
            CustomAddComponent={AddPlayerComponent}
            customRemoveFunction={removePlayerFromTeam}
            categoryName="team"
          />
        ) : (
          <p className="link-below-button">
            Head over to the <a href="/team-details">Team Details</a> page to create your team, then you will be able to add players.
          </p>
        )
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
