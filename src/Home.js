import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAppContext } from "./libs/contextLib";

export default function Home() {
  const { seasons, events } = useAppContext();
  const [season, setSeason] = useState({});
  const [seasonEvents, setSeasonEvents] = useState([]);

  useEffect(() => {
    if (seasons.length > 0) {
      const reversedSeasons = [...seasons];
      reversedSeasons.reverse();
      const currentSeason = reversedSeasons[0];
      setSeason(currentSeason);
      const eventsForSeason = events.filter((event) => event.seasonId === currentSeason.seasonId);
      let eventsWithLeagueDates = eventsForSeason.concat([
        {
          eventId: "season-start",
          eventName: "League Begins",
          startDate: currentSeason.startDate,
          seasonId: currentSeason.seasonId
        },
        {
          eventId: "season-end",
          eventName: "League Ends",
          startDate: currentSeason.endDate,
          seasonId: currentSeason.seasonId
        }
      ]);
      eventsWithLeagueDates = eventsWithLeagueDates.sort((a, b) => {
        if (a.startDate < b.startDate) return -1;
        if (a.startDate > b.startDate) return 1;
        return 0;
      });
      setSeasonEvents(eventsWithLeagueDates);
    }
  }, [seasons, events]);

  return (
    <div className="Home">
      <img className="landing-img" src="austin.jpg" alt="Austin Tennis League" />
      <div className="photo-overlay" />
      <div className="home-section-1">
        <div className="home-section-1-content">
          <h1 className="welcome">Welcome to the Austin Tennis League!</h1>
          <h3 className="welcome">Sponsoring Team Tennis for Men and Women Since 1971</h3>
          <Link to="/player-signup" className="btn btn-info btn-lg">
            Sign up to play
          </Link>
        </div>
      </div>
      <div className="home-section-2">
        <p>
          The Austin Tennis League (ATL) offers all levels of singles and doubles, in both Fall and Spring leagues.
          Matches are held on Saturdays throughout the Austin area, in addition to other ad hoc tennis activities.
        </p>
        {season.seasonName && (
          <>
            <h3>{`${season.seasonName || ""} Key Dates`}</h3>
            <div className="key-dates">
              <span className="key-dates-column">
                {seasonEvents.map((event) => (
                  <span key={event.eventId} className="key-date">
                    {event.endDate ? (
                      `${moment(event.startDate).format("MMM. D")} - ${moment(event.endDate).format("MMM. D")}`
                    ) : (
                      moment(event.startDate).format("MMM. D")
                    )}
                  </span>
                ))}
              </span>
              <span className="key-dates-column">
                {seasonEvents.map((event) => (
                  <span key={event.eventId} className="key-event">
                    {event.eventName}
                  </span>
                ))}
              </span>
            </div>
            <Link to="/calendar" className="btn btn-info btn-lg">
              View full calendar
            </Link>
          </>
        )}
      </div>
      <div className="home-section-3">
        <div className="home-section-3-card">
          <h3>New Player Program</h3>
          <p>
            In addition to league play, ATL offers other tennis activities to new players.
            "New" includes experienced players who are new to Austin or those returning to tennis after a break.
            For more info, contact Roger Vallejo at <a href="mailto:roger_vallejo@hotmail.com">roger_vallejo@hotmail.com</a>.
          </p>
        </div>
        <div className="home-section-3-card">
          <h3>Captain Registration</h3>
          <p>
            New captains should email Maggie Yanez at <a href="mailto:myanez@pharrtennis.com">myanez@pharrtennis.com</a> or call Maggie at (512) 477-4713 to get set up.
          </p>
        </div>
      </div>
    </div>
  );
}
