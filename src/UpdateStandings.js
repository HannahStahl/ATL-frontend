import React, { useState } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import LoaderButton from "./LoaderButton";

export default () => {
  const { standings, setStandings, allTeams, loadingData } = useAppContext();
  const [updatingStandings, setUpdatingStandings] = useState(false);
  const [updatedStandings, setUpdatedStandings] = useState(false);

  const columns = {
    teamId: {
      label: "Team Name",
      joiningTable: allTeams,
      joiningTableKey: "teamId",
      joiningTableFieldNames: ["teamName"]
    },
    setsWon: { label: "Sets Won" },
    setsLost: { label: "Sets Lost" },
    setsPlayed: { label: "Total Sets" },
    percentSetsWon: { label: "%", render: (value) => (parseFloat(value || 0) * 100).toFixed(2) },
    setsForfeited: { label: "Sets Forfeited", type: "number" }
  };

  const updateStandings = async () => {
    setUpdatingStandings(true);
    await API.put("atl-backend", "update/standing/all").then(() => {
      setUpdatingStandings(false);
      setUpdatedStandings(true);
    });
    const updatedStandings = await API.get("atl-backend", "list/standing");
    setStandings(updatedStandings);
  };

  return (
    <div className="container">
      <PageHeader>Standings</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
          <Table
            columns={columns}
            rows={standings}
            itemType="standing"
            primaryKey="teamId"
          />
          <div className="centered-content">
            <LoaderButton
              bsSize="large"
              bsStyle="primary"
              onClick={updateStandings}
              isLoading={updatingStandings}
              className="update-standings-btn"
            >
              Update Standings
            </LoaderButton>
          </div>
          <div className="centered-content">
            {updatedStandings && (
              <p>
                <i className="fas fa-check updated-standings" />
                Updated
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
