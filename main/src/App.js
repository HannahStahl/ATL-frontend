import React, { useState, useEffect } from "react";
import { Auth, API } from "aws-amplify";
import { Link, useHistory } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ErrorBoundary } from "atl-components";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import Routes from "./Routes";

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [profile, setProfile] = useState({});
  const [allTeams, setAllTeams] = useState([]);
  const [team, setTeam] = useState({});
  const [users, setUsers] = useState([]);
  const [allCaptains, setAllCaptains] = useState([]);
  const [matches, setMatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [users, user, teams, locations, divisions, associations, seasons, events] = await Promise.all([
        API.get("atl-backend", "list/user"),
        API.get("atl-backend", "getUser"),
        API.get("atl-backend", "list/team"),
        API.get("atl-backend", "list/location"),
        API.get("atl-backend", "list/division"),
        API.get("atl-backend", "list/association"),
        API.get("atl-backend", "list/season"),
        API.get("atl-backend", "list/event"),
      ]);
      setUsers(users);
      setAllCaptains(users.filter((user) => user.isCaptain));
      setProfile(user);
      setAllTeams(teams);
      setLocations(locations);
      setDivisions(divisions);
      setAssociations(associations);
      setSeasons(seasons);
      setEvents(events);
      const { userId } = user;
      if (user.isCaptain) {
        const captainTeam = teams.find((teamInList) => (
          teamInList.captainId === userId || teamInList.cocaptainId === userId
        ));
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
    setAllTeams([]);
    setTeam({});
    setAllCaptains([]);
    setMatches([]);
    setLocations([]);
    setDivisions([]);
    history.push("/login");
  }
  handleLogout();

  return (
    !isAuthenticating && (
      <div className="App">
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">ATL</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar fluid>
            <Nav pullRight>
              {isAuthenticated ? (
                profile && profile.userId ? (
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
                      <MenuItem href="/profile">My Profile</MenuItem>
                      {profile.isCaptain && <MenuItem href="/team-details">Team Details</MenuItem>}
                      {profile.isCaptain && <MenuItem href="/team-roster">Team Roster</MenuItem>}
                      {profile.isCaptain && <MenuItem href="/match-schedule">Match Schedule</MenuItem>}
                      {profile.isAdmin && <MenuItem href="/seasons">Seasons</MenuItem>}
                      {profile.isAdmin && <MenuItem href="/season-calendars">Season Calendars</MenuItem>}
                      {profile.isAdmin && <MenuItem href="/court-locations">Court Locations</MenuItem>}
                      {profile.isAdmin && <MenuItem href="/associations">Associations</MenuItem>}
                      {profile.isAdmin && <MenuItem href="/match-schedules">Match Schedules</MenuItem>}
                      {profile.isAdmin && <MenuItem href="/divisions">Divisions</MenuItem>}
                      {profile.isAdmin && <MenuItem href="/users">Users</MenuItem>}
                      <MenuItem onClick={handleLogout}>Log out</MenuItem>
                    </NavDropdown>
                  </React.Fragment>
                ) : <React.Fragment />
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
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{
            isAuthenticated,
            userHasAuthenticated,
            profile,
            setProfile,
            team,
            setTeam,
            matches,
            setMatches,
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
