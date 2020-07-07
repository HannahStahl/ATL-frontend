import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader, FormGroup, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import { Table } from "atl-components";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { seasons, events, setEvents, loadingData } = useAppContext();
  const [sortedSeasons, setSortedSeasons] = useState([]);
  const [season, setSeason] = useState({});

  useEffect(() => {
    if (seasons.length > 0) {
      const reversedSeasons = [...seasons];
      reversedSeasons.reverse();
      setSortedSeasons(reversedSeasons);
      setSeason(reversedSeasons[0]);
    }
  }, [seasons]);

  const columns = {
    eventName: { label: "Event", type: "text", required: true },
    startDate: {
      label: "Start Date",
      type: "date",
      required: true,
      render: (value) => value && moment(value).format("MMM. D")
    },
    endDate: {
      label: "End Date",
      type: "date",
      render: (value) => value && moment(value).format("MMM. D")
    },
  };

  const filterEvents = (list) => list.filter((event) => event.seasonId === season.seasonId);

  const addEvent = async (newEvent) => {
    const body = { ...newEvent, seasonId: season.seasonId };
    await API.post("atl-backend", `create/event`, { body });
    const newEvents = await API.get("atl-backend", "list/event");
    setEvents([...newEvents]);
  };

  return (
    <div>
      <PageHeader>Season Calendars</PageHeader>
      <form>
        <FormGroup controlId="seasonId">
          <FormControl
            value={(season && season.seasonId) || ''}
            componentClass="select"
            onChange={e => setSeason({ ...season, seasonId: e.target.value })}
          >
            <option value="" disabled>Select season</option>
            {sortedSeasons.map((season) => (
              <option key={season.seasonId} value={season.seasonId}>{season.seasonName}</option>
            ))}
          </FormControl>
        </FormGroup>
      </form>
      {!loadingData && (
        <Table
          columns={columns}
          rows={events}
          filterRows={filterEvents}
          setRows={setEvents}
          getRows={() => API.get("atl-backend", "list/event")}
          itemType="event"
          API={API}
          customAddFunction={addEvent}
        />
      )}
    </div>
  );
}
