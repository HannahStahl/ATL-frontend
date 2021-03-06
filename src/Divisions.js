import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { divisions, setDivisions, loadingData } = useAppContext();
  const columns = {
    divisionNumber: { label: "Number", type: "number", required: true },
  };

  return (
    <div className="container">
      <PageHeader>Divisions</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <Table
          columns={columns}
          rows={divisions}
          setRows={setDivisions}
          getRows={() => API.get("atl-backend", "list/division")}
          itemType="division"
          API={API}
        />
      )}
    </div>
  );
}
