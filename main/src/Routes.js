import React from "react";
import { Route, Switch } from "react-router-dom";
import { AuthenticatedRoute, UnauthenticatedRoute } from "atl-components";
import { useAppContext } from "./libs/contextLib";
import Home from "./containers/Home";
import PlayerSignup from "./containers/PlayerSignup";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Profile from "./containers/Profile";
import Team from "./containers/Team";
import Roster from "./containers/Roster";
import Matches from "./containers/Matches";
import NotFound from "./containers/NotFound";

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
      <UnauthenticatedRoute exact path="/captain-login" isAuthenticated={isAuthenticated}>
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
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
