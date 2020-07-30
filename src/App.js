import React, { useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import ErrorBoundary from "./ErrorBoundary";
import Routes from "./Routes";
import Footer from "./Footer";

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [profile, setProfile] = useState({});
  const [allTeams, setAllTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [allCaptains, setAllCaptains] = useState([]);
  const [locations, setLocations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [standings, setStandings] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  async function fetchPublicData() {
    const [
      users, teams, locations, divisions, associations, seasons, events, standings, matches
    ] = await Promise.all([
      API.get("atl-backend", "list/user"),
      API.get("atl-backend", "list/team"),
      API.get("atl-backend", "list/location"),
      API.get("atl-backend", "list/division"),
      API.get("atl-backend", "list/association"),
      API.get("atl-backend", "list/season"),
      API.get("atl-backend", "list/event"),
      API.get("atl-backend", "list/standing"),
      API.get("atl-backend", "list/match")
    ]);
    setUsers(users);
    setAllCaptains(users.filter((user) => user.isCaptain));
    setAllTeams(teams);
    setLocations(locations);
    setDivisions(divisions);
    setAssociations(associations);
    setSeasons(seasons);
    setEvents(events);
    setStandings(standings);
    setAllMatches(matches);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        await Auth.currentSession();
        userHasAuthenticated(true);
      }
      catch(e) {
        if (e !== 'No current user') onError(e);
      }
      setIsAuthenticating(false);
      fetchPublicData();
    }
    onLoad();
  }, []);

  useEffect(() => {
    async function fetchPrivateData() {
      const user = await API.get("atl-backend", "getUser");
      setProfile(user);
      setLoadingData(false);
    }
    if (isAuthenticated) fetchPrivateData();
  }, [isAuthenticated, allTeams]);

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    setProfile({});
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
            <Nav className="left-aligned">
              <NavDropdown eventKey={1} title="About the League" id="basic-nav-dropdown">
                <MenuItem eventKey={1.1} href="/info">General Info</MenuItem>
                <MenuItem eventKey={1.2} href="/faq">FAQs</MenuItem>
                <MenuItem eventKey={1.3} href="/history">League History</MenuItem>
                <MenuItem eventKey={1.4} href="/division-assignments">Division Assignments</MenuItem>
                <MenuItem eventKey={1.5} href="/bylaws">By-laws</MenuItem>
              </NavDropdown>
              <NavDropdown eventKey={2} title="Season Info" id="basic-nav-dropdown">
                <MenuItem eventKey={2.1} href="/calendar">Calendar</MenuItem>
                <MenuItem eventKey={2.2} href="/team-listing">Teams</MenuItem>
                <MenuItem eventKey={2.3} href="/schedules">Match Schedules</MenuItem>
                <MenuItem eventKey={2.4} href="/leader-board">Leader Board</MenuItem>
                <MenuItem eventKey={2.5} href="/standings">Detailed Standings</MenuItem>
                <MenuItem eventKey={2.6} href="/match-results">Match Results</MenuItem>
              </NavDropdown>
              <NavDropdown eventKey={3} title="Tennis in Austin" id="basic-nav-dropdown">
                <MenuItem eventKey={3.1} href="/locations">Court Locations</MenuItem>
                <MenuItem eventKey={3.2} href="/tennis-associations">Associations</MenuItem>
                <MenuItem eventKey={3.3} href="/tennis-centers">Centers</MenuItem>
                <MenuItem eventKey={3.4} href="/tennis-clubs">Clubs</MenuItem>
              </NavDropdown>
              <NavItem eventKey={4} href="/contact">Contact Us</NavItem>
            </Nav>
          </Navbar.Collapse>
          <Nav pullRight>
            {isAuthenticated ? (
              profile && profile.userId ? (
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
                    <MenuItem href="/profile">My Profile</MenuItem>
                    {profile.isCaptain && <MenuItem href="/team-info">Team Info</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/seasons">Seasons</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/season-calendars">Season Calendars</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/teams">Teams</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/players">Players</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/matches">Matches</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/update-standings">Standings</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/court-locations">Court Locations</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/associations">Associations</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/divisions">Divisions</MenuItem>}
                    {profile.isAdmin && <MenuItem href="/users">Users</MenuItem>}
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </NavDropdown>
                </>
              ) : <></>
            ) : (
              <LinkContainer to="/login">
                <NavItem>
                  Login
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
            users,
            setUsers,
            allCaptains,
            locations,
            setLocations,
            divisions,
            setDivisions,
            associations,
            setAssociations,
            seasons,
            setSeasons,
            events,
            setEvents,
            allTeams,
            setAllTeams,
            loadingData,
            standings,
            setStandings,
            allMatches,
            setAllMatches
          }}>
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
        <Footer />
      </div>
    )
  );
}

export default App;
