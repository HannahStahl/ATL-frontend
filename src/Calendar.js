import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import moment from "moment";
import { useAppContext } from "./libs/contextLib";

export default function Calendar() {
  const { seasons, events } = useAppContext();
  const [seasonEvents, setSeasonEvents] = useState({});

  useEffect(() => {
    if (seasons.length > 0 && events.length > 0 && Object.keys(seasonEvents).length === 0) {
      seasons.filter((season) => season.published).forEach((season) => {
        const eventsForSeason = events.filter((event) => event.seasonId === season.seasonId);
        if (season.rosterDeadline) {
          eventsForSeason.push({
            eventId: "roster-deadline",
            eventName: "Final Roster Deadline (11pm)",
            startDate: season.rosterDeadline,
            seasonId: season.seasonId
          });
        }
        if (season.startDate) {
          eventsForSeason.push({
            eventId: "season-start",
            eventName: "League Begins",
            startDate: season.startDate,
            seasonId: season.seasonId
          });
        }
        if (season.playerAdditionsStartDate && season.playerAdditionsEndDate) {
          eventsForSeason.push({
            eventId: "player-additions",
            eventName: "Player Additions (up to 2) (5pm)",
            startDate: season.playerAdditionsStartDate,
            endDate: season.playerAdditionsEndDate,
            seasonId: season.seasonId
          });
        }
        if (season.endDate) {
          eventsForSeason.push({
            eventId: "season-end",
            eventName: "League Ends",
            startDate: season.endDate,
            seasonId: season.seasonId
          });
        }
        const sortedEvents = eventsForSeason.sort((a, b) => {
          if (a.startDate < b.startDate) return -1;
          if (a.startDate > b.startDate) return 1;
          return 0;
        });
        seasonEvents[season.seasonName] = sortedEvents;
        setSeasonEvents(seasonEvents);
      });
    }
  }, [seasons, events, seasonEvents]);

  return (
    <div className="container">
      <PageHeader>Calendar</PageHeader>
      {Object.keys(seasonEvents).length > 0 ? (
        <div className="centered-content">
          <div className="season-calendars">
            {Object.keys(seasonEvents).map((seasonName) => {
              const season = seasonEvents[seasonName];
              return (
                <div key={seasonName} className="season-events-container">
                  <h3>{seasonName}</h3>
                  <table className="key-dates">
                    <tbody>
                      {season.map((event) => (
                        <tr key={event.eventId}>
                          <td className="key-date bold">
                            {event.endDate ? (
                              `${moment(event.startDate).format("dddd, MMMM D")} - ${moment(event.endDate).format("dddd, MMMM D")}`
                            ) : (
                              moment(event.startDate).format("dddd, MMMM D")
                            )}
                          </td>
                          <td className="key-date">{event.eventName || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      ) : <p className="centered-text">Loading...</p>}
    </div>
  );
}
