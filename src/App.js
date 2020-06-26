import React, { useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";
import "./App.css";
import config from './config';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [profile, setProfile] = useState({});
  const [allTeams, setAllTeams] = useState([]);
  const [team, setTeam] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);
  const [allCaptains, setAllCaptains] = useState([]);
  const [matches, setMatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [players, captains, captain, teams, locations, divisions] = await Promise.all([
        API.get("atl-backend", "list/player"),
        API.get("atl-backend", "list/captain"),
        API.get("atl-backend", "getCaptain"),
        API.get("atl-backend", "list/team"),
        fetch(`${config.adminApi}/list/location`).then((res) => res.json()),
        fetch(`${config.adminApi}/list/division`).then((res) => res.json()),
      ]);
      setAllPlayers(players);
      setAllCaptains(captains);
      setProfile(captain);
      setAllTeams(teams);
      setLocations(locations);
      setDivisions(divisions);
      const { captainId } = captain;
      const captainTeam = teams.find((teamInList) => teamInList.captainId === captainId);
      setTeam(captainTeam || {});
      if (captainTeam) {
        const { teamId } = captainTeam;
        const allMatches = await API.get("atl-backend", `list/match`);
        const teamMatches = allMatches.filter((match) => (
          match.homeTeamId === teamId || match.visitorTeamId === teamId
        )); // TODO do this on the backend
        setMatches(teamMatches);
      }
    }
    if (isAuthenticated) {
      fetchData();
    }
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
    history.push("/captain-login");
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
              {profile.captainId ? (
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
                    <MenuItem href="/captain-profile">My Profile</MenuItem>
                    <MenuItem href="/team-details">Team Details</MenuItem>
                    {team.teamId && <MenuItem href="/team-roster">Team Roster</MenuItem>}
                    {team.teamId && <MenuItem href="/match-schedule">Match Schedule</MenuItem>}
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/captain-login">
                  <NavItem>
                    Captain Login
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
            team,
            setTeam,
            allPlayers,
            setAllPlayers,
            matches,
            setMatches,
            allCaptains,
            locations,
            setLocations,
            divisions,
            setDivisions,
            allTeams
          }}>
            <div className="container"><Routes /></div>
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
