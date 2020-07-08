import React, { useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ErrorBoundary } from "atl-components";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import config from './config';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [profile, setProfile] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [seasons, events, teams, matches, profile, locations, associations, divisions] = await Promise.all([
        API.get("atl-backend", "list/season"),
        API.get("atl-backend", "list/event"),
        fetch(`${config.captainApi}/list/team`).then((res) => res.json()),
        fetch(`${config.captainApi}/list/match`).then((res) => res.json()),
        API.get("atl-backend", "getUser"),
        API.get("atl-backend", "list/location"),
        API.get("atl-backend", "list/association"),
        API.get("atl-backend", "list/division"),
      ]);
      setSeasons(seasons);
      setEvents(events);
      setTeams(teams);
      setMatches(matches);
      setProfile(profile);
      setLocations(locations);
      setAssociations(associations);
      setDivisions(divisions);
      setLoadingData(false);
    }
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') onError(e);
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    setProfile({});
    setSeasons([]);
    setEvents([]);
    setTeams([]);
    setMatches([]);
    setLocations([]);
    setAssociations([]);
    setDivisions([]);
    history.push("/login");
  }

  return (
    !isAuthenticating && (
      <div className="App">
        <Navbar fluid>
          <Nav pullRight>
            {isAuthenticated ? (
              profile.userId ? (
                <React.Fragment>
                  <NavDropdown
                    title={(
                      <p>
                        {`${profile.firstName} ${profile.lastName}`}
                        <i className="fas fa-user-circle" />
                      </p>
                    )}
                    id="basic-nav-dropdown"
                  >
                    <MenuItem href="/user-profile">My Profile</MenuItem>
                    <MenuItem href="/seasons">Seasons</MenuItem>
                    <MenuItem href="/season-calendars">Season Calendars</MenuItem>
                    <MenuItem href="/court-locations">Court Locations</MenuItem>
                    <MenuItem href="/associations">Associations</MenuItem>
                    <MenuItem href="/match-schedules">Match Schedules</MenuItem>
                    <MenuItem href="/divisions">Divisions</MenuItem>
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </NavDropdown>
                </React.Fragment>
              ) : <React.Fragment />
            ) : (
              <LinkContainer to="/login">
                <NavItem>
                  Admin Login
                  <i className="fas fa-user-circle" />
                </NavItem>
              </LinkContainer>
            )}
          </Nav>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{
            isAuthenticated,
            userHasAuthenticated,
            profile,
            setProfile,
            seasons,
            setSeasons,
            events,
            setEvents,
            teams,
            matches,
            locations,
            setLocations,
            associations,
            setAssociations,
            divisions,
            setDivisions,
            loadingData,
          }}>
            <div className="container"><Routes /></div>
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
