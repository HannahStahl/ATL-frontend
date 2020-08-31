import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";

export default ({ team }) => {
  const { divisionId } = team;
  const { loadingData, allTeams, allCaptains } = useAppContext();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (allTeams && allTeams.length > 0 && divisionId) {
      setTeams(allTeams.filter((team) => team.isActive && team.divisionId === divisionId));
    }
  }, [allTeams, divisionId]);

  return !loadingData && divisionId ? (
    <>
      <hr className="team-details-page-break" />
      <h1 className="team-details-page-header">Division Details</h1>
      <div className="centered-content">
        <div className="centered-content-inner">
          {teams.length > 0 ? (
            <div className="table-container">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Team #</th>
                    <th>Team Name</th>
                    <th>Captain/Co-Captain</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => {
                    const { captainId, cocaptainId } = team;
                    const captain = captainId && allCaptains.find((captainInList) => captainInList.userId === captainId);
                    const cocaptain = cocaptainId && allCaptains.find((captainInList) => captainInList.userId === cocaptainId);
                    return (
                      <React.Fragment key={team.teamId}>
                        <tr>
                          <td>{team.teamNumber || ""}</td>
                          <td>{team.teamName}</td>
                          <td>
                            {captain ? `${captain.firstName || ""} ${captain.lastName || ""}` : ""}
                          </td>
                          <td>{(captain && captain.phone) || ""}</td>
                          <td>{(captain && captain.email) || ""}</td>
                        </tr>
                        {cocaptain && (
                          <tr>
                            <td className="white">{team.teamNumber || ""}</td>
                            <td className="white">{team.teamName}</td>
                            <td>{`${cocaptain.firstName || ""} ${cocaptain.lastName || ""}`}</td>
                            <td>{cocaptain.phone || ""}</td>
                            <td>{cocaptain.email || ""}</td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : <p className="centered-text">Loading...</p>}
        </div>
      </div>
    </>
  ) : <div />;
};
