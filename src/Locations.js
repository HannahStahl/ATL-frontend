import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { locations, setLocations, loadingData } = useAppContext();
  const columns = {
    locationName: { label: "Name", type: "text", required: true },
    locationType: {
      label: "Type",
      type: "dropdown",
      options: [{ value: "Center", name: "Center" }, { value: "Club", name: "Club" }]
    },
    numCourts: { label: "# of Courts", type: "number" },
    courtGrade: { label: "Court Grade", type: "text" },
    area: { label: "Area", type: "text" },
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
    websiteUrl: {
      label: "Website Link",
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
  };

  return (
    <div className="container">
      <PageHeader>Court Locations</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <Table
          columns={columns}
          rows={locations}
          setRows={setLocations}
          getRows={() => API.get("atl-backend", "list/location")}
          itemType="location"
          API={API}
        />
      )}
    </div>
  );
}
