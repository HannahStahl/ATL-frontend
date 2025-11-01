import React from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
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
import Ratings from "./Ratings";
import Contact from "./Contact";
import PlayerSignup from "./PlayerSignup";
import Login from "./Login";
import Signup from "./Signup";
import PortalHome from "./PortalHome";
import Profile from "./Profile";
import Team from "./Team";
import Seasons from "./Seasons";
import Calendars from "./Calendars";
import Teams from "./Teams";
import Payments from "./Payments";
import Players from "./Players";
import PlayersLooking from "./PlayersLooking";
import Locations from "./Locations";
import Associations from "./Associations";
import Divisions from "./Divisions";
import Schedules from "./Schedules";
import Users from "./Users";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
import NotFound from "./NotFound";
import Payment from "./Payment";
import MakeupMatches from "./MakeupMatches";

export default function Routes() {
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
      <Route exact path="/ratings">
        <Ratings />
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
      <Route exact path="/player-signup">
        <PlayerSignup />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/reset-password">
        <ForgotPassword />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/portal">
        <PortalHome />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/profile">
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/team-info">
        <Team />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/players-looking">
        <PlayersLooking />
      </AuthenticatedRoute>
      <Route exact path="/payment">
        <Payment />
      </Route>
      <AuthenticatedRoute exact path="/makeup-matches">
        <MakeupMatches />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/seasons">
        <Seasons />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/season-calendars">
        <Calendars />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/teams">
        <Teams />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/payments">
        <Payments />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/players">
        <Players />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/court-locations">
        <Locations />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/associations">
        <Associations />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/matches">
        <Schedules />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/divisions">
        <Divisions />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/users">
        <Users />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/change-password">
        <ChangePassword />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
