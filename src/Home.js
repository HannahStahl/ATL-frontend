import React, { useState, useEffect } from "react";
import moment from "moment";
import Masonry from "react-masonry-component";
import { Table } from "react-bootstrap";
import { useAppContext } from "./libs/contextLib";
import { getOrderedTeamsInDivision } from "./LeaderBoard";
import config from "./config";

export default function Home() {
  const { seasons, events, divisions, allTeams, standings } = useAppContext();
  const [season, setSeason] = useState({});
  const [seasonEvents, setSeasonEvents] = useState([]);
  const [weather, setWeather] = useState([]);
  const weatherHours = window.innerWidth >= 850 ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3];

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

  useEffect(() => {
    const getWeather = async () => {
      const weatherJson = await fetch(config.weatherUrl).then((res) => res.json());
      setWeather(weatherJson.hourly);
    };
    getWeather();
  }, []);

  return (
    <div className="Home">
      <img className="landing-img" src={`${config.cloudfrontUrl}/austin.jpg`} alt="Austin Tennis League" />
      <div className="photo-overlay" />
      <div className="home-section-1">
        <div className="home-section-1-content">
          <h1 className="welcome">Welcome to the Austin Tennis League!</h1>
          <h3 className="welcome">Sponsoring Team Tennis for Men and Women Since 1971</h3>
        </div>
      </div>
      <div className="home-section-2">
        <h4 className="home-section-2-intro">
          The Austin Tennis League (ATL) offers all levels of singles and doubles, in both Fall and Spring leagues.
          Matches are held on Saturdays throughout the Austin area, in addition to other ad hoc tennis activities.
        </h4>
        <Masonry
          className="masonry-layout"
          options={{ isFitWidth: true }}
        >
          <div className="home-section-2-card">
            <h3>Sign Up to Play</h3>
            <p>
              New to Austin or ATL? <a href="/player-signup">Sign up to participate</a> in the league.
            </p>
          </div>
          <div className="home-section-2-card leader-board-card">
            <h3>Leader Board</h3>
            <div className="table-container">
              <Table hover className="home-page-leader-board interactive-table">
                <thead>
                  <tr>
                    <th>Division</th>
                    <th>1st</th>
                    <th>2nd</th>
                    <th>3rd</th>
                  </tr>
                </thead>
                <tbody>
                  {divisions.map((division) => {
                    const teams = getOrderedTeamsInDivision(allTeams, standings, division.divisionId);
                    const standingsUrl = `/standings?divisionId=${division.divisionId}`;
                    return (
                      <tr key={division.divisionId} onClick={() => window.location.href = standingsUrl}>
                        <td>{division.divisionNumber}</td>
                        {[0, 1, 2].map((index) => <td key={index}>{teams[index]}</td>)}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
          <div className="home-section-2-card">
            <h3>Captain Registration</h3>
            <p>
              New captains should email Maggie Yanez at <a href="mailto:myanez@pharrtennis.com">myanez@pharrtennis.com</a> or call Maggie at (512) 477-4713 to get set up.
            </p>
          </div>
          <div className="home-section-2-card calendar-card">
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
          <div className="home-section-2-card weather-card">
            <h2>Today in Austin</h2>
            {weather.length > 0 && (
              <div className="weather">
                {weatherHours.map((index) => {
                  const hour = weather[index];
                  return (
                    <div key={index} className="weather-hour">
                      <img
                        src={`${config.weatherIconBaseUrl}/${hour.weather[0].icon}@2x.png`}
                        alt={hour.weather[0].description}
                      />
                      <h4>{moment.unix(hour.dt).format("hA")}</h4>
                      <h3>{`${hour.temp.toFixed(0)}°F`}</h3>
                      <p>{hour.weather[0].main}</p>
                      <p>
                        <i className="raindrop fas fa-tint" />
                        {`${hour.pop.toFixed(0)}%`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <a
              className="link-below-button"
              href="https://www.accuweather.com/en/us/austin/78701/hourly-weather-forecast/351193"
              target="_blank"
              rel="noopener noreferrer"
            >
              View full forecast
              <i className="weather-external-link fas fa-external-link-alt" />
            </a>
            <a
              className="link-below-button"
              href="https://www.kvue.com/article/weather/allergy-forecast/allergy-report/269-44055429"
              target="_blank"
              rel="noopener noreferrer"
            >
              View allergy report
              <i className="weather-external-link fas fa-external-link-alt" />
            </a>
          </div>
        </Masonry>
      </div>
    </div>
  );
}
