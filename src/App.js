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

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [profile, setProfile] = useState({});
  const [team, setTeam] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
      const [players, captain] = await Promise.all([
        API.get("atl-backend", "list/player"),
        API.get("atl-backend", "getCaptain")
      ]);
      setAllPlayers(players);
      setProfile(captain);
      const teams = await API.get("atl-backend", "list/team");
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
              {isAuthenticated ? (
                <NavDropdown title={<i className="fas fa-user-circle" />} id="basic-nav-dropdown">
                  <MenuItem href="/captain-profile">My Profile</MenuItem>
                  <MenuItem href="/team-details">Team Details</MenuItem>
                  <MenuItem href="/team-roster">Team Roster</MenuItem>
                  <MenuItem href="/match-schedule">Match Schedule</MenuItem>
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/captain-signup">
                    <NavItem>Sign up</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/captain-login">
                    <NavItem>Log in</NavItem>
                  </LinkContainer>
                </>
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
            setMatches
          }}>
            <div className="container"><Routes /></div>
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
    )
  );
}

export default App;
