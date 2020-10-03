import React, { useState, useEffect } from "react";
import moment from "moment";
import { PageHeader, FormGroup, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import Table from "./Table";
import { useAppContext } from "./libs/contextLib";

export default () => {
  const { seasons, events, setEvents, loadingData } = useAppContext();
  const [eventsWithLeagueDates, setEventsWithLeagueDates] = useState([]);
  const [season, setSeason] = useState({});

  useEffect(() => {
    if (seasons.length > 0) {
      let index = 0;
      const selectedSeasonId = window.location.search.split('?seasonId=')[1];
      if (selectedSeasonId) {
        index = seasons.findIndex((seasonInList) => seasonInList.seasonId === selectedSeasonId);
      }
      setSeason(seasons[index]);
    }
  }, [seasons]);

  useEffect(() => {
    if (!events.find((event) => event.eventId === "season-start")) {
      if (season.rosterDeadline) {
        events.push({
          eventId: "roster-deadline",
          eventName: "Final Roster Deadline (11pm)",
          startDate: season.rosterDeadline,
          seasonId: season.seasonId,
          readOnly: true
        });
      }
      if (season.startDate) {
        events.push({
          eventId: "season-start",
          eventName: "League Begins",
          startDate: season.startDate,
          seasonId: season.seasonId,
          readOnly: true
        });
      }
      if (season.playerAdditionsStartDate && season.playerAdditionsEndDate) {
        events.push({
          eventId: "player-additions",
          eventName: "Player Additions (up to 2) (5pm)",
          startDate: season.playerAdditionsStartDate,
          endDate: season.playerAdditionsEndDate,
          seasonId: season.seasonId,
          readOnly: true
        });
      }
      if (season.endDate) {
        events.push({
          eventId: "season-end",
          eventName: "League Ends",
          startDate: season.endDate,
          seasonId: season.seasonId,
          readOnly: true
        });
      }
      const sortedEvents = events.sort((a, b) => {
        if (a.startDate < b.startDate) return -1;
        if (a.startDate > b.startDate) return 1;
        return 0;
      });
      setEventsWithLeagueDates(sortedEvents);
    }
  }, [events, season]);

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
    <div className="container">
      <PageHeader>Season Calendars</PageHeader>
      <form>
        <FormGroup controlId="seasonId">
          <FormControl
            value={(season && season.seasonId) || ''}
            componentClass="select"
            onChange={e => setSeason(seasons.find((seasonInList) => seasonInList.seasonId === e.target.value))}
          >
            <option value="" disabled>Select season</option>
            {seasons.map((season) => (
              <option key={season.seasonId} value={season.seasonId}>{season.seasonName}</option>
            ))}
          </FormControl>
        </FormGroup>
      </form>
      {loadingData ? <p className="centered-text">Loading...</p> : (
        <>
          <Table
            columns={columns}
            rows={eventsWithLeagueDates}
            filterRows={filterEvents}
            setRows={setEvents}
            getRows={() => API.get("atl-backend", "list/event")}
            itemType="event"
            API={API}
            customAddFunction={addEvent}
          />
          <div className="link-below-button">
            <p>To edit the read-only events on this page, visit the <a href="/seasons">Seasons</a> page.</p>
          </div>
        </>
      )}
    </div>
  );
}
