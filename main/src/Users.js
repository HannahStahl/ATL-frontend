import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { loadingData } = useAppContext();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("atl-backend", "list/user").then(setUsers);
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
    "email": { label: "Email", type: "email", required: true, readOnly: true },
  };

  return (
    <div>
      <PageHeader>Users</PageHeader>
      {!loadingData && (
        <Table
          columns={columns}
          rows={users}
          setRows={setUsers}
          getRows={() => API.get("atl-backend", "list/user")}
          itemType="user"
          API={API}
          disableCreate
        />
      )}
    </div>
  );
}
