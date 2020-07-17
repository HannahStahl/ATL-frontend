import React from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { associations, setAssociations, loadingData } = useAppContext();
  const columns = {
    associationName: { label: "Name", type: "text", required: true },
    websiteUrl: {
      label: "Link",
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
    }
  };

  return (
    <div>
      <PageHeader>Associations</PageHeader>
      {!loadingData && (
        <Table
          columns={columns}
          rows={associations}
          setRows={setAssociations}
          getRows={() => API.get("atl-backend", "list/association")}
          itemType="association"
          API={API}
        />
      )}
    </div>
  );
}
