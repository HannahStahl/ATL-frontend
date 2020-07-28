import React from "react";
import moment from "moment";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { seasons, setSeasons, loadingData } = useAppContext();

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
    currentSeason: {
      label: "Current Season?",
      type: "checkbox",
      render: (value) => value ? <i className="fas fa-check" /> : ""
    },
    seasonId: {
      label: "",
      render: (value) => <a href={`/season-calendars?seasonId=${value}`}>View Events</a>
    }
  };

  const editSeason = async (seasonId, body) => {
    const original = seasons.find((season) => season.seasonId === seasonId);
    const promises = [API.put("atl-backend", `update/season/${seasonId}`, { body })];
    if (original.currentSeason !== body.currentSeason) {
      const otherSeason = seasons.find((season) => season.seasonId !== seasonId);
      promises.push(API.put("atl-backend", `update/season/${otherSeason.seasonId}`, { body: {
        ...otherSeason, currentSeason: !otherSeason.currentSeason
      } }))
    }
    await Promise.all(promises);
    const updatedSeasons = await API.get("atl-backend", "list/season");
    setSeasons([...updatedSeasons]);
  };

  return (
    <div className="container">
      <PageHeader>Seasons</PageHeader>
      {!loadingData && (
        <Table
          columns={columns}
          rows={seasons}
          setRows={setSeasons}
          getRows={() => API.get("atl-backend", "list/season")}
          itemType="season"
          API={API}
          createDisabled
          removeDisabled
          customEditFunction={editSeason}
        />
      )}
    </div>
  );
}
