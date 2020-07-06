import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader } from "react-bootstrap";
import { EditForm } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default function Season() {
  const { season, setSeason } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const saveSeason = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    await API.put("atl-backend", "update/season/1", { body });
    setSeason(body);
    setIsLoading(false);
  };

  const columns = {
    seasonName: { label: "Season Name", type: "text", required: true },
    registrationStartDate: { label: "Team Registration Start Date", type: "date" },
    registrationEndDate: { label: "Team Registration End Date", type: "date" },
    startDate: { label: "League Play Start Date", type: "date" },
  };

  return (
    <div>
      <PageHeader>Season Details</PageHeader>
      <EditForm
        fields={columns}
        original={season}
        save={saveSeason}
        isLoading={isLoading}
      />
    </div>
  );
}
