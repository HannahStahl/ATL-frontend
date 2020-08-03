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
      const currentSeason = seasons.find((season) => season.currentSeason);
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
        <h4 className="home-section-2-intro">
          The Austin Tennis League (ATL) offers all levels of singles and doubles, in both Fall and Spring leagues.
          Matches are held on Saturdays throughout the Austin area, in addition to other ad hoc tennis activities.
        </h4>
        <div className="home-section-2-cards">
          <div className="home-section-2-card">
            {season.seasonName && (
              <>
                <h3>{`${season.seasonName || ""} Key Dates`}</h3>
                <table className="key-dates home-page-calendar">
                  <tbody>
                    {seasonEvents.map((event) => (
                      <tr key={event.eventId}>
                        <td className="key-date bold">
                          {event.endDate ? (
                            `${moment(event.startDate).format("MMM. D")} - ${moment(event.endDate).format("MMM. D")}`
                          ) : (
                            moment(event.startDate).format("MMM. D")
                          )}
                        </td>
                        <td className="key-date key-event">{event.eventName || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <a href="/calendar">View full calendar</a>
              </>
            )}
          </div>
          <div className="home-section-2-card">
            <h3>New Player Program</h3>
            <p>
              In addition to league play, ATL offers other tennis activities to new players.
              "New" includes experienced players who are new to Austin or those returning to tennis after a break.
              For more info, contact Roger Vallejo at <a href="mailto:roger_vallejo@hotmail.com">roger_vallejo@hotmail.com</a>.
            </p>
          </div>
          <div className="home-section-2-card">
            <h3>Captain Registration</h3>
            <p>
              New captains should email Maggie Yanez at <a href="mailto:myanez@pharrtennis.com">myanez@pharrtennis.com</a> or call Maggie at (512) 477-4713 to get set up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
