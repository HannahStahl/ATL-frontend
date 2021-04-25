import React, { useEffect, useState } from "react";
import moment from "moment";
import { PageHeader } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";
import SwitchCurrentSeasonModal from './SwitchCurrentSeasonModal';

export default () => {
  const { seasons, setSeasons, loadingData } = useAppContext();
  const [switchingSeason, setSwitchingSeason] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(seasons.find((season) => season.currentSeason));
  
  useEffect(() => {
    setCurrentSeason(seasons.find((season) => season.currentSeason));
  }, [seasons]);

  const columns = {
    seasonName: { label: "Name", type: "text", required: true },
    rosterDeadline: {
      label: "Roster Deadline",
      type: "date",
      render: (value) => value && moment(value).format("MMM. D")
    },
    startDate: {
      label: "League Start Date",
      type: "date",
      required: true,
      render: (value) => value && moment(value).format("MMM. D")
    },
    playerAdditionsStartDate: {
      label: "Player Additions Start Date",
      type: "date",
      render: (value) => value && moment(value).format("MMM. D")
    },
    playerAdditionsEndDate: {
      label: "Player Additions End Date",
      type: "date",
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

  const editSeason = async (seasonId, body) => {
    await API.put("atl-backend", `update/season/${seasonId}`, { body });
    const updatedSeasons = await API.get("atl-backend", "list/season");
    setSeasons([...updatedSeasons]);
  };

  return (
    <div className="container">
      <PageHeader>Seasons</PageHeader>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
          <p className="centered-text">
            Current season is: <b>{currentSeason ? currentSeason.seasonName : ""}</b>
          </p>
          <p className="centered-text switch-current-season link">
            <a onClick={() => setSwitchingSeason(true)}>Switch current season</a>
          </p>
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
        </>
      )}
      <SwitchCurrentSeasonModal switchingSeason={switchingSeason} setSwitchingSeason={setSwitchingSeason} />
    </div>
  );
}
