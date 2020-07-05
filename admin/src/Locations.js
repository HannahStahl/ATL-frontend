import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { locations, setLocations } = useAppContext();
  const columns = {
    locationName: { label: "Name", type: "text", required: true },
    area: { label: "Area", type: "text" },
    courtGrade: { label: "Court Grade", type: "text" },
    numCourts: { label: "Number of Courts", type: "number" },
    address: { label: "Address", type: "text" },
    city: { label: "City", type: "text" },
    zip: { label: "Zip Code", type: "text" },
    tennisMapsUrl: {
      label: "Tennis Maps Link",
      type: "text",
      render: (value) => {
        return value && (
          <a
            href={value.startsWith('http') ? value : `http://${value}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        );
      }
    },
    directions: { label: "Directions", type: "textarea" },
  };

  return (
    <div>
      <PageHeader>Court Locations</PageHeader>
      <Table columns={columns} rows={locations} setRows={setLocations} itemType="location" API={API} />
    </div>
  );
}
