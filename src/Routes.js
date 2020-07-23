import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import { useAppContext } from "./libs/contextLib";
import Home from "./Home";
import LeagueHistory from "./LeagueHistory";
import FAQ from "./FAQ";
import GeneralInfo from "./GeneralInfo";
import Bylaws from "./Bylaws";
import Problems from "./Problems";
import DivisionAssignments from "./DivisionAssignments";
import TeamListing from "./TeamListing";
import TeamRoster from "./TeamRoster";
import DivisionSchedules from "./DivisionSchedules";
import Calendar from "./Calendar";
import LeaderBoard from "./LeaderBoard";
import Standings from "./Standings";
import MatchResults from "./MatchResults";
import MatchResult from "./MatchResult";
import CourtLocations from "./CourtLocations";
import TennisAssociations from "./TennisAssociations";
import Centers from "./Centers";
import Clubs from "./Clubs";
import Contact from "./Contact";
import PlayerSignup from "./PlayerSignup";
import Login from "./Login";
import Signup from "./Signup";
import PortalHome from "./PortalHome";
import Profile from "./Profile";
import Team from "./Team";
import Roster from "./Roster";
import Matches from "./Matches";
import Seasons from "./Seasons";
import Calendars from "./Calendars";
import Teams from "./Teams";
import Players from "./Players";
import Locations from "./Locations";
import Associations from "./Associations";
import Divisions from "./Divisions";
import Schedules from "./Schedules";
import Users from "./Users";
import ChangePassword from "./ChangePassword";
import NotFound from "./NotFound";

export default function Routes() {
  const { isAuthenticated } = useAppContext();
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/history">
        <LeagueHistory />
      </Route>
      <Route exact path="/faq">
        <FAQ />
      </Route>
      <Route exact path="/info">
        <GeneralInfo />
      </Route>
      <Route exact path="/bylaws">
        <Bylaws />
      </Route>
      <Route exact path="/problems">
        <Problems />
      </Route>
      <Route exact path="/division-assignments">
        <DivisionAssignments />
      </Route>
      <Route exact path="/team-listing">
        <TeamListing />
      </Route>
      <Route exact path="/roster/:teamId">
        <TeamRoster />
      </Route>
      <Route exact path="/schedules">
        <DivisionSchedules />
      </Route>
      <Route exact path="/calendar">
        <Calendar />
      </Route>
      <Route exact path="/leader-board">
        <LeaderBoard />
      </Route>
      <Route exact path="/standings">
        <Standings />
      </Route>
      <Route exact path="/match-results">
        <MatchResults />
      </Route>
      <Route exact path="/match-results/:matchId">
        <MatchResult />
      </Route>
      <Route exact path="/locations">
        <CourtLocations />
      </Route>
      <Route exact path="/tennis-associations">
        <TennisAssociations />
      </Route>
      <Route exact path="/tennis-centers">
        <Centers />
      </Route>
      <Route exact path="/tennis-clubs">
        <Clubs />
      </Route>
      <Route exact path="/contact">
        <Contact />
      </Route>
      <Route exact path="/player-signup" isAuthenticated={isAuthenticated}>
        <PlayerSignup />
      </Route>
      <UnauthenticatedRoute exact path="/login" isAuthenticated={isAuthenticated}>
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup" isAuthenticated={isAuthenticated}>
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/portal" isAuthenticated={isAuthenticated}>
        <PortalHome />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/profile" isAuthenticated={isAuthenticated}>
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/team-details" isAuthenticated={isAuthenticated}>
        <Team />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/team-roster" isAuthenticated={isAuthenticated}>
        <Roster />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/match-schedule" isAuthenticated={isAuthenticated}>
        <Matches />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/seasons" isAuthenticated={isAuthenticated}>
        <Seasons />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/season-calendars" isAuthenticated={isAuthenticated}>
        <Calendars />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/teams" isAuthenticated={isAuthenticated}>
        <Teams />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/players" isAuthenticated={isAuthenticated}>
        <Players />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/court-locations" isAuthenticated={isAuthenticated}>
        <Locations />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/associations" isAuthenticated={isAuthenticated}>
        <Associations />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/match-schedules" isAuthenticated={isAuthenticated}>
        <Schedules />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/divisions" isAuthenticated={isAuthenticated}>
        <Divisions />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/users" isAuthenticated={isAuthenticated}>
        <Users />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/change-password" isAuthenticated={isAuthenticated}>
        <ChangePassword />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
