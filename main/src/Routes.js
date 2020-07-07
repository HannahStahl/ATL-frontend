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
      <UnauthenticatedRoute exact path="/captain-signup" isAuthenticated={isAuthenticated}>
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/captain-profile" isAuthenticated={isAuthenticated}>
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
