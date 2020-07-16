import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { seasons, setSeasons, loadingData } = useAppContext();
  const [sortedSeasons, setSortedSeasons] = useState([]);

  useEffect(() => {
    if (seasons.length > 0) {
      const reversedSeasons = [...seasons];
      reversedSeasons.reverse();
      setSortedSeasons(reversedSeasons);
    }
  }, [seasons]);

  const columns = {
    seasonName: { label: "Name", type: "text", required: true },
    startDate: {
      label: "League Start Date",
      type: "date",
      required: true,
      render: (value) => value && moment(value).format("MMM. D")
    },
    endDate: {
      label: "League End Date",
      type: "date",
      render: (value) => value && moment(value).format("MMM. D")
    },
    seasonId: {
      label: "",
      render: (value) => <a href={`/season-calendars?seasonId=${value}`}>View Events</a>
    }
  };

  return (
    <div>
      <PageHeader>Seasons</PageHeader>
      {!loadingData && (
        <Table
          columns={columns}
          rows={sortedSeasons}
          setRows={setSeasons}
          getRows={() => API.get("atl-backend", "list/season")}
          itemType="season"
          API={API}
        />
      )}
    </div>
  );
}
