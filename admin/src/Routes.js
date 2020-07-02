import React from "react";
import { Route, Switch } from "react-router-dom";
import { AuthenticatedRoute, UnauthenticatedRoute } from "atl-components";
import { useAppContext } from "./libs/contextLib";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Profile from "./containers/Profile";
import Locations from "./containers/Locations";
import Divisions from "./containers/Divisions";
import Schedules from "./containers/Schedules";
import NotFound from "./containers/NotFound";

export default function Routes() {
  const { isAuthenticated } = useAppContext();
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <UnauthenticatedRoute exact path="/login" isAuthenticated={isAuthenticated}>
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup" isAuthenticated={isAuthenticated}>
        <Signup />
      </UnauthenticatedRoute>
      <AuthenticatedRoute exact path="/user-profile" isAuthenticated={isAuthenticated}>
        <Profile />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/court-locations" isAuthenticated={isAuthenticated}>
        <Locations />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/match-schedules" isAuthenticated={isAuthenticated}>
        <Schedules />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/divisions" isAuthenticated={isAuthenticated}>
        <Divisions />
      </AuthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
