import React, { useState, useEffect } from "react";
import { FormControl, FormGroup, ControlLabel, PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import LoaderButton from "./LoaderButton";
import EditForm from "./EditForm";

export default () => {
  const { allTeams } = useAppContext();
  const [activePlayers, setActivePlayers] = useState([]);
  const [inactivePlayers, setInactivePlayers] = useState([]);
  const [playerLastName, setPlayerLastName] = useState(undefined);
  const [playersWithLastName, setPlayersWithLastName] = useState([]);
  const [addingPlayer, setAddingPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      API.get("atl-backend", "list/player"),
      API.get("atl-backend", "list/inactivePlayer"),
    ]).then((results) => {
      const [activePlayers, inactivePlayers] = results;
      setActivePlayers(activePlayers);
      setInactivePlayers(inactivePlayers);
    });
  }, []);

  const columns = {
    "name": {
      label: "Name",
      children: [
        { key: "firstName", label: "First Name", type: "text", required: true },
        { key: "lastName", label: "Last Name", type: "text", required: true },
      ]
    },
    "teamId": {
      label: "Team",
      type: "dropdown",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    },
    "phone": { label: "Phone", type: "text", placeholder: "xxx-xxx-xxxx" },
    "email": { label: "Email", type: "email" },
    "rating": {
      label: "Rating",
      type: "number",
      step: 0.5,
      render: (rating) => rating ? parseFloat(rating).toFixed(1) : ""
    },
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

  const getFormFields = () => {
    const fields = {};
    Object.keys(columns).forEach((key) => {
      const column = columns[key];
      if (!column.readOnly) {
        if (column.children) {
          column.children.forEach((child) => {
            if (!child.readOnly) fields[child.key] = child;
          });
        } else fields[key] = column;
      }
    });
    return fields;
  };

  const createPlayer = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    const newPlayer = await API.post("atl-backend", "createPlayer", { body });
    setActivePlayers([newPlayer, ...activePlayers]);
    setIsLoading(false);
    setAddingPlayer(false);
  };

  const editPlayer = async (playerId, body) => {
    const index = playersWithLastName.findIndex((player) => player.playerId === playerId);
    playersWithLastName[index] = body;
    const activePlayerIndex = activePlayers.findIndex((player) => player.playerId === playerId);
    if (activePlayerIndex > -1) {
      await API.put("atl-backend", `update/player/${playerId}`, { body });
      activePlayers[activePlayerIndex] = body;
      setActivePlayers([...activePlayers]);
    } else {
      const inactivePlayerIndex = inactivePlayers.findIndex((player) => player.playerId === playerId);
      await API.put("atl-backend", `update/inactivePlayer/${playerId}`, { body });
      inactivePlayers[inactivePlayerIndex] = body;
      setInactivePlayers([...inactivePlayers]);
    }
    setPlayersWithLastName([...playersWithLastName]);
  };

  return (
    <div className="container">
      {addingPlayer ? (
        <>
          <PageHeader>Add a Player</PageHeader>
          <div className="max-width-form">
            <EditForm
              fields={getFormFields()}
              save={createPlayer}
              isLoading={isLoading}
            />
          </div>
        </>
      ) : (
        <>
          <PageHeader>Players</PageHeader>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="primary"
            onClick={() => setAddingPlayer(true)}
          >
            Add new player to database
          </LoaderButton>
          <hr />
          <form onSubmit={(event) => {
            event.preventDefault();
            setPlayersWithLastName([...activePlayers, ...inactivePlayers].filter(
              (player) => playerLastName && player.lastName.toLowerCase().includes(playerLastName.toLowerCase())
            ));
          }}>
            <FormGroup>
              <ControlLabel>Search for a player by last name:</ControlLabel>
              <FormControl
                value={playerLastName || ''}
                type="text"
                onChange={e => setPlayerLastName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <LoaderButton
                block
                bsSize="large"
                bsStyle="primary"
                type="submit"
              >
                Search
              </LoaderButton>
            </FormGroup>
            {playersWithLastName.length > 0 && (
              <Table
                columns={columns}
                rows={playersWithLastName}
                itemType="player"
                setRows={setActivePlayers} // Doesn't actually get used, so doesn't matter what it is
                createDisabled
                removeDisabled
                customEditFunction={editPlayer}
                API={API}
              />
            )}
          </form>
        </>
      )}
    </div>
  );
}
