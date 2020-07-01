import React, { useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import config from './config';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [profile, setProfile] = useState({});
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [teams, matches, profile, locations, divisions] = await Promise.all([
        fetch(`${config.captainApi}/list/team`).then((res) => res.json()),
        fetch(`${config.captainApi}/list/match`).then((res) => res.json()),
        API.get("atl-backend", "getUser"),
        API.get("atl-backend", "list/location"),
        API.get("atl-backend", "list/division"),
      ]);
      setTeams(teams);
      setMatches(matches);
      setProfile(profile);
      setLocations(locations);
      setDivisions(divisions);
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
                <>
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
                    <MenuItem href="/court-locations">Court Locations</MenuItem>
                    <MenuItem href="/match-schedules">Match Schedules</MenuItem>
                    <MenuItem href="/divisions">Divisions</MenuItem>
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </NavDropdown>
                </>
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
            teams,
            matches,
            locations,
            setLocations,
            divisions,
            setDivisions,
          }}>
            <div className="container"><Routes /></div>
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
