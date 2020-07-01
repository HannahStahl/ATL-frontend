import React from "react";
import { Route, Switch } from "react-router-dom";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

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
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/player-signup">
        <PlayerSignup />
      </Route>
      <UnauthenticatedRoute exact path="/captain-login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/captain-signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/captain-profile">
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/team-details">
        <Team />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/team-roster">
        <Roster />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/match-schedule">
        <Matches />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
