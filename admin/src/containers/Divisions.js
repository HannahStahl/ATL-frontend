import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "../libs/contextLib";

export default () => {
  const { divisions, setDivisions } = useAppContext();
  const columns = {
    divisionNumber: { label: "Number", type: "number", required: true },
  };

  return (
    <div>
      <PageHeader>Divisions</PageHeader>
      <Table columns={columns} rows={divisions} setRows={setDivisions} itemType="division" API={API} />
    </div>
  );
}
