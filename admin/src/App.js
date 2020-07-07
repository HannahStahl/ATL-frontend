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
  const [season, setSeason] = useState({});
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
      const [season, teams, matches, profile, locations, associations, divisions] = await Promise.all([
        API.get("atl-backend", "get/season/1"),
        fetch(`${config.captainApi}/list/team`).then((res) => res.json()),
        fetch(`${config.captainApi}/list/match`).then((res) => res.json()),
        API.get("atl-backend", "getUser"),
        API.get("atl-backend", "list/location"),
        API.get("atl-backend", "list/association"),
        API.get("atl-backend", "list/division"),
      ]);
      setSeason(season);
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
    setSeason({});
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
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">ATL</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {profile.userId ? (
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
                    <MenuItem href="/season-details">Season Details</MenuItem>
                    <MenuItem href="/court-locations">Court Locations</MenuItem>
                    <MenuItem href="/associations">Associations</MenuItem>
                    <MenuItem href="/match-schedules">Match Schedules</MenuItem>
                    <MenuItem href="/divisions">Divisions</MenuItem>
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </NavDropdown>
                </React.Fragment>
              ) : (
                <LinkContainer to="/login">
                  <NavItem>
                    Admin Login
                    <i className="fas fa-user-circle" />
                  </NavItem>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{
            isAuthenticated,
            userHasAuthenticated,
            profile,
            setProfile,
            season,
            setSeason,
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
