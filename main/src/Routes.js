import React from "react";
import { Route, Switch } from "react-router-dom";
import { AuthenticatedRoute, UnauthenticatedRoute } from "atl-components";
import { useAppContext } from "./libs/contextLib";
import Home from "./Home";
import PlayerSignup from "./PlayerSignup";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import Team from "./Team";
import Roster from "./Roster";
import Matches from "./Matches";
import Seasons from "./Seasons";
import Calendars from "./Calendars";
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
      <Route exact path="/player-signup" isAuthenticated={isAuthenticated}>
        <PlayerSignup />
      </Route>
      <UnauthenticatedRoute exact path="/login" isAuthenticated={isAuthenticated}>
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup" isAuthenticated={isAuthenticated}>
        <Signup />
      </UnauthenticatedRoute>
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
