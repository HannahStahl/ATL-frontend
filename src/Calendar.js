import React, { useState, useEffect } from "react";
import { PageHeader } from "react-bootstrap";
import moment from "moment";
import { useAppContext } from "./libs/contextLib";

export default function Calendar() {
  const { seasons, events } = useAppContext();
  const [seasonEvents, setSeasonEvents] = useState({});

  useEffect(() => {
    if (seasons.length > 0 && events.length > 0 && Object.keys(seasonEvents).length === 0) {
      seasons.forEach((season) => {
        const eventsForSeason = events.filter((event) => event.seasonId === season.seasonId);
        let eventsWithLeagueDates = eventsForSeason.concat([
          {
            eventId: "season-start",
            eventName: "League Begins",
            startDate: season.startDate,
            seasonId: season.seasonId
          },
          {
            eventId: "season-end",
            eventName: "League Ends",
            startDate: season.endDate,
            seasonId: season.seasonId
          }
        ]);
        eventsWithLeagueDates = eventsWithLeagueDates.sort((a, b) => {
          if (a.startDate < b.startDate) return -1;
          if (a.startDate > b.startDate) return 1;
          return 0;
        });
        seasonEvents[season.seasonName] = eventsWithLeagueDates;
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
                              `${moment(event.startDate).format("MMM. D")} - ${moment(event.endDate).format("MMM. D")}`
                            ) : (
                              moment(event.startDate).format("MMM. D")
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
