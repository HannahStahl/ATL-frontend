import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { locations, setLocations } = useAppContext();
  // TODO add other columns/fields
  const columns = {
    locationName: { label: "Name", type: "text", required: true },
  };

  return (
    <div>
      <PageHeader>Court Locations</PageHeader>
      <Table columns={columns} rows={locations} setRows={setLocations} itemType="location" API={API} />
    </div>
  );
}
