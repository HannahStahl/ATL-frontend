import React from "react";
import { Route, Switch } from "react-router-dom";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Profile from "./containers/Profile";
import Locations from "./containers/Locations";
import Divisions from "./containers/Divisions";
import Schedules from "./containers/Schedules";
import NotFound from "./containers/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/user-profile">
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/court-locations">
        <Locations />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/match-schedules">
        <Schedules />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/divisions">
        <Divisions />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
