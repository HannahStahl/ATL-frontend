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
import config from "./config";

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
  const [draftMatches, setDraftMatches] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [loadingPublicData, setLoadingPublicData] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchPublicData() {
      const [
        users, teams, locations, divisions, associations, seasons, events,
        standings, matches, draftMatches, matchResults
      ] = await Promise.all([
        API.get("atl-backend", "list/user"),
        API.get("atl-backend", "list/team"),
        API.get("atl-backend", "list/location"),
        API.get("atl-backend", "list/division"),
        API.get("atl-backend", "list/association"),
        API.get("atl-backend", "list/season"),
        API.get("atl-backend", "list/event"),
        API.get("atl-backend", "list/standing"),
        API.get("atl-backend", "list/match"),
        API.get("atl-backend", "list/draftMatch"),
        API.get("atl-backend", "list/matchResult")
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
      setDraftMatches(draftMatches);
      setMatchResults(matchResults);
      setLoadingPublicData(false);
    }
    async function onLoad() {
      try {
        await Auth.currentSession();
        userHasAuthenticated(true);
      }
      catch(e) {
        if (e && e !== 'No current user') onError(e);
      }
      setIsAuthenticating(false);
      fetchPublicData();
    }
    onLoad();
  }, []);

  useEffect(() => {
    async function fetchPrivateData() {
      try {
        const user = await API.get("atl-backend", "getUser");
        setProfile(user);
      } catch(e) {
        console.log(e);
      }
      setLoadingData(false);
    }
    if (isAuthenticated && !loadingPublicData) fetchPrivateData();
  }, [isAuthenticated, loadingPublicData]);

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    setProfile({});
    history.push("/login");
  }

  const logoFilename = window.devicePixelRatio === 2 ? "logo_2x" : "logo";

  return (
    !isAuthenticating && (
      <div className="App">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">
                <img
                  src={`${config.cloudfrontUrl}/${logoFilename}.${window.innerWidth >= 1000 ? 'jpg' : 'png'}`}
                  alt="ATL"
                />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav className="left-aligned">
              <NavDropdown eventKey={1} title="About the League" id="basic-nav-dropdown">
                <MenuItem eventKey={1.1} href="/player-signup">New Player Registration</MenuItem>
                <MenuItem eventKey={1.2} href="/info">General Info</MenuItem>
                <MenuItem eventKey={1.3} href="/faq">FAQs</MenuItem>
                <MenuItem eventKey={1.4} href="/history">League History</MenuItem>
                <MenuItem eventKey={1.5} href="/division-assignments">Division Assignments</MenuItem>
                <MenuItem eventKey={1.6} href="/bylaws">By-laws</MenuItem>
              </NavDropdown>
              <NavDropdown eventKey={2} title="Season Info" id="basic-nav-dropdown">
                <MenuItem eventKey={2.1} href="/calendar">Calendar</MenuItem>
                <MenuItem eventKey={2.2} href="/team-listing">Team Rosters</MenuItem>
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
                        {window.innerWidth > 1000 && `${profile.firstName} ${profile.lastName}`}
                        <i className="fas fa-user-circle" />
                      </p>
                    )}
                    id="basic-nav-dropdown"
                  >
                    <MenuItem href="/profile">My Profile</MenuItem>
                    <MenuItem href="/team-info">My Team Info</MenuItem>
                    <MenuItem href="/payment">Payment</MenuItem>
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
                  {window.innerWidth > 1000 && 'Login'}
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
            setAllMatches,
            draftMatches,
            setDraftMatches,
            matchResults,
            setMatchResults
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
